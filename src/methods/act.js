import defer from './../utils/defer';
import makeRequest from './../utils/make-request';
import { ACT_TIMEOUT, STATE_RUN } from './../constants';

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
  const route = app.manager.find(request);
  
  if (!route) {
    app.log.info(`Вызов не существующего маршрута`, { pin });
    return dfd.reject({
      code   : 'error.common/act.not.found',
      message: 'Вызов не существующего маршрута'
    });
  }
  
  const timerId = setTimeout(() => dfd.reject(new Error('error.common/act.timeout')), ACT_TIMEOUT);
  
  try {
    let promise = route.callback(request, route);
    
    if (!promise || typeof promise.then !== 'function') {
      promise = Promise.resolve(promise);
    }
    
    promise
      .then(result => {
        clearTimeout(timerId);
        dfd.resolve(result);
      })
      .catch((error) => {
        clearTimeout(timerId);
        dfd.resolve(error);
      });
    
    return dfd.promise;
  } catch (error) {
    app.log.error(`Ошибка при вызове маршрута`, { pin, error: error.toString() });
    clearTimeout(timerId);
    return dfd.reject(error);
  }
}