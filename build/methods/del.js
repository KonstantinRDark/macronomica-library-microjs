'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash.isstring');

var _lodash2 = _interopRequireDefault(_lodash);

var _jsonic = require('jsonic');

var _jsonic2 = _interopRequireDefault(_jsonic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    const route = app.manager.find((0, _lodash2.default)(pin) ? (0, _jsonic2.default)(pin) : pin);

    if (!route) {
      app.log.trace(`Удаление несуществующего маршрута`, pin);
      return app;
    }

    const action = route.action;


    app.log.info(`Удаление маршрута`, { pin, action });

    app.manager.remove(pin);

    return app;
  };
};
//# sourceMappingURL=del.js.map