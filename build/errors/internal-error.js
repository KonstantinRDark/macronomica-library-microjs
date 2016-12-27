'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (app, outError) {
  let info = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  const e = (0, _error2.default)((0, _extends3.default)({ message: _error.ERROR_INTERNAL_ERROR }, info));
  app.log.error(e.message, { error: outError });
  return e;
};
//# sourceMappingURL=internal-error.js.map