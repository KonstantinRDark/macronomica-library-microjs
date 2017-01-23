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
      app.log.trace(`microjs.common.del.not-found`, pin);
      return app;
    }

    const { action } = route;

    app.log.trace(`microjs.common.del.${ action.name || action.id }`, { pin, action });

    app.manager.remove(pin);

    return app;
  };
};