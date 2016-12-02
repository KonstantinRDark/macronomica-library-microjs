'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _apiFetch = require('./../plugins/api-fetch');

var _apiFetch2 = _interopRequireDefault(_apiFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {app} app
 * @returns {function}
 */
exports.default = app => {
  /**
   * @namespace app.api
   * @param {string} name
   * @param {object} [settings]
   * @returns {app}
   */
  return function (name) {
    let settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return app.use((0, _apiFetch2.default)(app, { name, settings }));
  };
};
//# sourceMappingURL=api.js.map