import isString from 'lodash.isstring';
import jsonic from 'jsonic';
import genid from './../utils/genid';

/**
 * @param {app} app
 * @returns {function}
 */
export default app => {
  /**
   * @namespace app.add
   * @param {string|object} pin
   * @param {function} cb
   * @returns {app}
   */
  return (pin, cb) => {
    const action = {
      id  : genid(),
      name: cb.name || ''
    };
    app.log.info(`Добавление нового маршрута`, { action });

    app.manager.add(isString(pin) ? jsonic(pin) : pin, { pin, action, callback: cb });

    return app;
  };
};