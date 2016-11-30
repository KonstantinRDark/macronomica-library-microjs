'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LEVEL_DEFAULT = exports.LEVEL_FATAL = exports.LEVEL_ERROR = exports.LEVEL_WARN = exports.LEVEL_DEBUG = exports.LEVEL_TRACE = exports.LEVEL_INFO = exports.LEVEL_OFF = exports.LEVEL_ALL = undefined;

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.LEVEL_ALL = _constants.LEVEL_ALL;
exports.LEVEL_OFF = _constants.LEVEL_OFF;
exports.LEVEL_INFO = _constants.LEVEL_INFO;
exports.LEVEL_TRACE = _constants.LEVEL_TRACE;
exports.LEVEL_DEBUG = _constants.LEVEL_DEBUG;
exports.LEVEL_WARN = _constants.LEVEL_WARN;
exports.LEVEL_ERROR = _constants.LEVEL_ERROR;
exports.LEVEL_FATAL = _constants.LEVEL_FATAL;
exports.LEVEL_DEFAULT = _constants.LEVEL_DEFAULT;

exports.default = settings => new _app2.default(settings);
//# sourceMappingURL=index.js.map