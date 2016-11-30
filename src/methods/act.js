import isString from 'lodash.isstring';
import jsonic from 'jsonic';
import defer from './../utils/defer';

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
    const dfd = defer(cb);
    const msg = isString(pin) ? jsonic(pin) : pin;
    const route = app.manager.find(msg);

    if (!route) {
      if (msg.cmd !== 'logger') {
        app.log.trace(`Вызов не существующего маршрута`, pin);
      }
      return dfd.reject(`Вызов не существующего маршрута`);
    }

    try {
      let promise = route.callback(msg, route);

      if (!promise || typeof promise.then !== 'function') {
        promise = Promise.resolve(promise);
      }

      promise.then(dfd.resolve).catch(dfd.reject);

      return dfd.promise;
    } catch (err) {
      app.log.error(`Ошибка при вызове маршрута`, pin, err);
      return dfd.reject(err);
    }
  };
}