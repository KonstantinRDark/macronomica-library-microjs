'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LEVEL_DEFAULT = exports.LEVEL_FATAL = exports.LEVEL_ERROR = exports.LEVEL_WARN = exports.LEVEL_DEBUG = exports.LEVEL_TRACE = exports.LEVEL_INFO = exports.LEVEL_OFF = exports.LEVEL_ALL = exports.STATE_RUN = exports.STATE_START = exports.END_TIMEOUT = exports.ACT_TIMEOUT = undefined;

var _lodash = require('lodash.isnumber');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _process$env = process.env,
    _process$env$DEF_TIME = _process$env.DEF_TIMEOUT;
const defTimeout = _process$env$DEF_TIME === undefined ? 5000 : _process$env$DEF_TIME;
var _process$env$ACT_TIME = _process$env.ACT_TIMEOUT;
const actTimeout = _process$env$ACT_TIME === undefined ? 5000 : _process$env$ACT_TIME;
var _process$env$END_TIME = _process$env.END_TIMEOUT;
const endTimeout = _process$env$END_TIME === undefined ? 5000 : _process$env$END_TIME;


const DEF_TIMEOUT = (0, _lodash2.default)(defTimeout) ? defTimeout : 5000;

const ACT_TIMEOUT = exports.ACT_TIMEOUT = (0, _lodash2.default)(+actTimeout) && !isNaN(+actTimeout) ? actTimeout : DEF_TIMEOUT;
const END_TIMEOUT = exports.END_TIMEOUT = (0, _lodash2.default)(+endTimeout) && !isNaN(+endTimeout) ? endTimeout : DEF_TIMEOUT;

const STATE_START = exports.STATE_START = 'start';
const STATE_RUN = exports.STATE_RUN = 'run';

const LEVEL_ALL = exports.LEVEL_ALL = 'all';
const LEVEL_OFF = exports.LEVEL_OFF = 'off';
const LEVEL_INFO = exports.LEVEL_INFO = 'info';
const LEVEL_TRACE = exports.LEVEL_TRACE = 'trace';
const LEVEL_DEBUG = exports.LEVEL_DEBUG = 'debug';
const LEVEL_WARN = exports.LEVEL_WARN = 'warn';
const LEVEL_ERROR = exports.LEVEL_ERROR = 'error';
const LEVEL_FATAL = exports.LEVEL_FATAL = 'fatal';

const LEVEL_DEFAULT = exports.LEVEL_DEFAULT = process.env.NODE_ENV !== 'development' ? LEVEL_INFO : 'DEBUG' in process.env ? LEVEL_DEBUG : LEVEL_TRACE;
//# sourceMappingURL=constants.js.map