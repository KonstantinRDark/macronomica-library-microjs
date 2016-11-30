import isString from 'lodash.isstring';
import jsonic from 'jsonic';
import defer from './../utils/defer';
import { STATE_RUN } from './../constants';

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
      return exec();
    }
    let dfd = defer(exec);

    app.on('running', () => setTimeout(dfd.resolve, 10));

    return dfd.promise;

    function exec() {
      const dfd = defer(cb);
      const msg = isString(pin) ? jsonic(pin) : pin;
      const route = app.manager.find(msg);

      if (!route) {
        app.log.trace(`Вызов не существующего маршрута`, pin);
        return dfd.reject(`Вызов не существующего маршрута: ${ JSON.stringify(pin) }`);
      }

      try {
        let promise = route.callback(msg, route);

        if (!promise || typeof promise.then !== 'function') {
          promise = Promise.resolve(promise);
        }

        promise.then(dfd.resolve).catch(dfd.reject);

        return dfd.promise;
      } catch (error) {
        app.log.error(`Ошибка при вызове маршрута`, { pin, error });
        return dfd.reject(err);
      }
    }
  };
}