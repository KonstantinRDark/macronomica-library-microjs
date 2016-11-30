'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash.isstring');

var _lodash2 = _interopRequireDefault(_lodash);

var _jsonic = require('jsonic');

var _jsonic2 = _interopRequireDefault(_jsonic);

var _genid = require('./../utils/genid');

var _genid2 = _interopRequireDefault(_genid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {app} app
 * @returns {function}
 */
exports.default = function (app) {
  /**
   * @namespace app.add
   * @param {string|object} pin
   * @param {function} cb
   * @returns {app}
   */
  return function (pin, cb) {
    var action = {
      id: (0, _genid2.default)(),
      name: cb.name || ''
    };
    app.log.info('\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043D\u043E\u0432\u043E\u0433\u043E \u043C\u0430\u0440\u0448\u0440\u0443\u0442\u0430', { action: action });

    app.manager.add((0, _lodash2.default)(pin) ? (0, _jsonic2.default)(pin) : pin, { pin: pin, action: action, callback: cb });

    return app;
  };
};
//# sourceMappingURL=add.js.map