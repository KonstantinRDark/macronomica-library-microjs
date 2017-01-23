import TypedError from 'error/typed';
import WrappedError from 'error/wrapped';
import isNumber from 'lodash.isnumber';
import defer from './../utils/defer';
import makeRequest, { clear } from './../utils/make-request';
import { ACT_TIMEOUT, STATE_RUN } from './../constants';

const ERROR_TYPE = 'micro.act';

const ActInternalError = WrappedError({
  message: '{name}: {origMessage}',
  type   : `${ ERROR_TYPE }.internal`
});

const ActNotFoundError = TypedError({
  message: '{name}: Вызов не существующего маршрута',
  type   : `${ ERROR_TYPE }.not.found`,
  code   : 404
});

const TimeoutError = TypedError({
  message: '{name}: Превышено время выполнения (timeout={timeout}) запроса',
  type   : `${ ERROR_TYPE }.timeout`,
  timeout: null,
  code   : 408
});

/**
 * @param {app} app
 * @returns {function:app}
 */
export default app => {
  /**
   * @namespace app.act
   * @param {string|object} pin
   * @param {function} [cb]
   * @returns {app}
   */
  return (pin, cb) => {
    if (app.state === STATE_RUN) {
      return exec(app, pin, cb);
    }
    
    let dfd = defer(() => exec(app, pin, cb));
    
    app.on('running', () => setTimeout(dfd.resolve, 10));
    
    return dfd.promise;
  };
};

function exec(app, pin, cb) {
  const dfd = defer(cb);
  const request = makeRequest(app, pin);
  const route = app.manager.find(clear(request));
  const meta = {
    pin      : clear(request),
    action   : !!route ? route.action : undefined,
    request  : request.request,
    transport: request.transport
  };

  if (!route) {
    const error = ActNotFoundError();
    app.log.warn(error.message, meta);
    return dfd.reject(error);
  }
  const timeout = isNumber(+request.timeout) && !isNaN(+request.timeout)
    ? +request.timeout
    : ACT_TIMEOUT;
  let timerId;
  
  if (+timeout !== -1) {
    timerId = setTimeout(() => {
      const wrapped = TimeoutError({ timeout });
      app.log.warn(wrapped, { ...meta, action: route.action });
      dfd.reject(wrapped);
    }, timeout);
  }

  app.log.trace(`[${ meta.request.id }] Маршрут (action=${ route.action.name || route.action.id })`, meta);

  try {
    let promise = route.callback(request, route);

    if (!promise || typeof promise.then !== 'function') {
      promise = Promise.resolve(promise);
    }

    promise
      .then(result => {
        if (timerId) { clearTimeout(timerId) }
        dfd.resolve(result);
      })
      .catch((error) => {
        if (timerId) { clearTimeout(timerId) }
        dfd.reject(error);
      });
  }
  catch (error) {
    const wrapped = ActInternalError(error);
    if (timerId) { clearTimeout(timerId) }

    app.log.error(wrapped, meta);
    dfd.reject(wrapped);
  }

  return dfd.promise;
}