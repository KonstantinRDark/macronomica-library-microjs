"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * @param {app} app
 * @returns {function}
 */
exports.default = function (app) {
  /**
   * @namespace app.del
   * @param {string|object} pin
   * @returns {app}
   */
  return function (pin) {
    var route = app.manager.find(pin);

    if (!route) {
      app.log.trace("\u0423\u0434\u0430\u043B\u0435\u043D\u0438\u0435 \u043D\u0435\u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u044E\u0449\u0435\u0433\u043E \u043C\u0430\u0440\u0448\u0440\u0443\u0442\u0430", pin);
      return app;
    }

    var action = route.action;


    app.log.info("\u0423\u0434\u0430\u043B\u0435\u043D\u0438\u0435 \u043C\u0430\u0440\u0448\u0440\u0443\u0442\u0430", action);

    app.manager.remove(pin);

    return app;
  };
};
//# sourceMappingURL=del.js.map