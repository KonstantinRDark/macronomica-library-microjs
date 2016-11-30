'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _LEVELS;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var LEVEL_ALL = exports.LEVEL_ALL = 'all';
var LEVEL_OFF = exports.LEVEL_OFF = 'off';
var LEVEL_INFO = exports.LEVEL_INFO = 'info';
var LEVEL_TRACE = exports.LEVEL_TRACE = 'trace';
var LEVEL_DEBUG = exports.LEVEL_DEBUG = 'debug';
var LEVEL_WARN = exports.LEVEL_WARN = 'warn';
var LEVEL_ERROR = exports.LEVEL_ERROR = 'error';
var LEVEL_FATAL = exports.LEVEL_FATAL = 'fatal';
/**
 * @name LEVELS
 * @type {Object<string, number>}
 * @enum {number}
 */
var LEVELS = exports.LEVELS = (_LEVELS = {}, _defineProperty(_LEVELS, LEVEL_ALL, 0), _defineProperty(_LEVELS, LEVEL_INFO, 10), _defineProperty(_LEVELS, LEVEL_TRACE, 20), _defineProperty(_LEVELS, LEVEL_DEBUG, 30), _defineProperty(_LEVELS, LEVEL_WARN, 40), _defineProperty(_LEVELS, LEVEL_ERROR, 50), _defineProperty(_LEVELS, LEVEL_FATAL, 60), _defineProperty(_LEVELS, LEVEL_OFF, 100), _LEVELS);

/**
 * @param {app} app
 * @param { string } [level]
 * @returns {object}
 */

exports.default = function (app) {
  var _logger;

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

  /**
   * @namespace app.log
   */
  var logger = (_logger = {
    /**
     * @memberof app.log
     * @type {string}
     */
    level: level,
    /**
     * @memberof app.log
     * @type {Object<!string, !number>}
     */
    LEVELS: LEVELS
  }, _defineProperty(_logger, LEVEL_DEBUG, log(LEVEL_DEBUG)), _defineProperty(_logger, LEVEL_TRACE, log(LEVEL_TRACE)), _defineProperty(_logger, LEVEL_INFO, log(LEVEL_INFO)), _defineProperty(_logger, LEVEL_WARN, log(LEVEL_WARN)), _defineProperty(_logger, LEVEL_ERROR, log(LEVEL_ERROR)), _defineProperty(_logger, LEVEL_FATAL, log(LEVEL_FATAL)), _logger);

  return logger;

  /**
   * @param {string} level
   * @returns {function(string, ...[*])}
   */
  function log(level) {
    return function (message) {
      for (var _len = arguments.length, payload = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        payload[_key - 1] = arguments[_key];
      }

      if (LEVELS[logger.level] < LEVELS[level]) {
        return logger;
      }

      app.act({ cmd: 'logger', level: level, message: message, payload: payload }).catch(function (result) {
        var _console;

        return (_console = console).log.apply(_console, [level + '\t' + message].concat(payload));
      });

      return logger;
    };
  }
};
//# sourceMappingURL=log.js.map