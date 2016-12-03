'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ERROR_PROPERTY_MUST_BE_NOT_EMPTY_ARRAY = exports.ERROR_PROPERTY_MUST_BE = exports.ERROR_PROPERTY_IS_REQUIRED = exports.ERROR_INTERNAL_ERROR = exports.ERROR_SEPARATOR = exports.propertyMustBeNotEmptyArrayError = exports.propertyMustBeTypeError = exports.propertyIsRequiredError = exports.internalError = exports.error = exports.genid = exports.defer = exports.iterate = exports.WinstonLogPlugin = exports.LEVEL_DEFAULT = exports.LEVEL_FATAL = exports.LEVEL_ERROR = exports.LEVEL_WARN = exports.LEVEL_DEBUG = exports.LEVEL_TRACE = exports.LEVEL_INFO = exports.LEVEL_OFF = exports.LEVEL_ALL = undefined;

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _logWinston = require('./plugins/log-winston');

var _logWinston2 = _interopRequireDefault(_logWinston);

var _genid = require('./utils/genid');

var _genid2 = _interopRequireDefault(_genid);

var _defer = require('./utils/defer');

var _defer2 = _interopRequireDefault(_defer);

var _iterate = require('./utils/iterate');

var _iterate2 = _interopRequireDefault(_iterate);

var _errors = require('./errors');

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
exports.WinstonLogPlugin = _logWinston2.default;
exports.iterate = _iterate2.default;
exports.defer = _defer2.default;
exports.genid = _genid2.default;
exports.error = _errors.error;
exports.internalError = _errors.internalError;
exports.propertyIsRequiredError = _errors.propertyIsRequiredError;
exports.propertyMustBeTypeError = _errors.propertyMustBeTypeError;
exports.propertyMustBeNotEmptyArrayError = _errors.propertyMustBeNotEmptyArrayError;
exports.ERROR_SEPARATOR = _errors.ERROR_SEPARATOR;
exports.ERROR_INTERNAL_ERROR = _errors.ERROR_INTERNAL_ERROR;
exports.ERROR_PROPERTY_IS_REQUIRED = _errors.ERROR_PROPERTY_IS_REQUIRED;
exports.ERROR_PROPERTY_MUST_BE = _errors.ERROR_PROPERTY_MUST_BE;
exports.ERROR_PROPERTY_MUST_BE_NOT_EMPTY_ARRAY = _errors.ERROR_PROPERTY_MUST_BE_NOT_EMPTY_ARRAY;

exports.default = settings => new _app2.default(settings);
//# sourceMappingURL=index.js.map