"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * @param {app} app
 * @returns {function}
 */
exports.default = app => {
  /**
   * @namespace app.del
   * @param {string|object} pin
   * @returns {app}
   */
  return pin => {
    const route = app.manager.find(pin);

    if (!route) {
      app.log.trace(`Удаление несуществующего маршрута`, pin);
      return app;
    }

    const action = route.action;


    app.log.info(`Удаление маршрута`, action);

    app.manager.remove(pin);

    return app;
  };
};
//# sourceMappingURL=del.js.map