import isString from 'lodash.isstring';
import jsonic from 'jsonic';

/**
 * @param {app} app
 * @returns {function}
 */
export default app => {
  /**
   * @namespace app.del
   * @param {string|object} pin
   * @returns {app}
   */
  return (pin) => {
    const route = app.manager.find(isString(pin) ? jsonic(pin) : pin);

    if (!route) {
      app.log.trace(`Удаление несуществующего маршрута`, pin);
      return app;
    }

    const { action } = route;

    app.log.trace(`Удаление маршрута`, { pin, action });

    app.manager.remove(pin);

    return app;
  };
};