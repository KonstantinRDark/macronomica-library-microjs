'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = log;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var LEVEL_ALL = exports.LEVEL_ALL = 'all';
var LEVEL_OFF = exports.LEVEL_OFF = 'off';
var LEVEL_INFO = exports.LEVEL_INFO = 'info';
var LEVEL_TRACE = exports.LEVEL_TRACE = 'trace';
var LEVEL_DEBUG = exports.LEVEL_DEBUG = 'debug';
var LEVEL_WARN = exports.LEVEL_WARN = 'warn';
var LEVEL_ERROR = exports.LEVEL_ERROR = 'error';
var LEVEL_FATAL = exports.LEVEL_FATAL = 'fatal';
var LEVELS = exports.LEVELS = {
  LEVEL_ALL: 0,

  LEVEL_INFO: 10,
  LEVEL_TRACE: 20,
  LEVEL_DEBUG: 30,
  LEVEL_WARN: 40,
  LEVEL_ERROR: 50,
  LEVEL_FATAL: 60,

  LEVEL_OFF: 100
};

function log(microjs) {
  var _Object$assign;

  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$level = _ref.level,
      level = _ref$level === undefined ? LEVEL_DEBUG : _ref$level;

  /**
   * Levels:
   *
   * ALL    Все уровни
   * OFF    Отключить ведение журнала
   *
   * INFO   Информационные сообщения
   * TRACE  Информационные сообщения, с дополнительной информацией
   * DEBUG  Информационные события, которые наиболее полезны для отладки приложения.
   *
   * WARN   Предупреждения о потенциально опасных ситуациях
   * ERROR  Ошибка, но которая позволяет приложению продолжать работать
   * FATAL  Ошибка, которая приводит завершению приложения
   */
  var logger = {};

  return Object.assign(logger, (_Object$assign = {
    level: level,
    LEVELS: LEVELS
  }, _defineProperty(_Object$assign, LEVEL_DEBUG, log(LEVEL_DEBUG)), _defineProperty(_Object$assign, LEVEL_TRACE, log(LEVEL_TRACE)), _defineProperty(_Object$assign, LEVEL_INFO, log(LEVEL_INFO)), _defineProperty(_Object$assign, LEVEL_WARN, log(LEVEL_WARN)), _defineProperty(_Object$assign, LEVEL_ERROR, log(LEVEL_ERROR)), _defineProperty(_Object$assign, LEVEL_FATAL, log(LEVEL_FATAL)), _Object$assign));

  function log(level) {
    return function (message) {
      for (var _len = arguments.length, payload = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        payload[_key - 1] = arguments[_key];
      }

      if (LEVELS[logger.level] < LEVELS[level]) {
        return logger;
      }

      microjs.act({ cmd: 'logger', level: level, message: message, payload: payload }).catch(function (result) {
        var _console;

        return (_console = console).log.apply(_console, [message].concat(payload));
      });

      return logger;
    };
  }
}
//# sourceMappingURL=log.js.map