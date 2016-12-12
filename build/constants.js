'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
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