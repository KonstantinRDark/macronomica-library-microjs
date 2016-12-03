'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _internalError = require('./internal-error');

var _internalError2 = _interopRequireDefault(_internalError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (app) {
  let info = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return outError => (0, _internalError2.default)(app, outError, info);
};
//# sourceMappingURL=internal-error-promise.js.map