'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const LEVEL_ALL = exports.LEVEL_ALL = 'all';
const LEVEL_OFF = exports.LEVEL_OFF = 'off';
const LEVEL_INFO = exports.LEVEL_INFO = 'info';
const LEVEL_TRACE = exports.LEVEL_TRACE = 'trace';
const LEVEL_DEBUG = exports.LEVEL_DEBUG = 'debug';
const LEVEL_WARN = exports.LEVEL_WARN = 'warn';
const LEVEL_ERROR = exports.LEVEL_ERROR = 'error';
const LEVEL_FATAL = exports.LEVEL_FATAL = 'fatal';
/**
 * @name LEVELS
 * @type {Object<string, number>}
 * @enum {number}
 */
const LEVELS = exports.LEVELS = {
  [LEVEL_ALL]: 0,

  [LEVEL_FATAL]: 10,
  [LEVEL_ERROR]: 20,
  [LEVEL_WARN]: 30,
  [LEVEL_INFO]: 40,
  [LEVEL_TRACE]: 50,
  [LEVEL_DEBUG]: 60,

  [LEVEL_OFF]: 100
};

/**
 * @param {app} app
 * @param { string } [level]
 * @returns {object}
 */

exports.default = function (app) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$level = _ref.level;

  let level = _ref$level === undefined ? LEVEL_DEBUG : _ref$level;

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
  const logger = {
    /**
     * @memberof app.log
     * @type {string}
     */
    level,
    /**
     * @memberof app.log
     * @type {Object<!string, !number>}
     */
    LEVELS,
    /**
     * @memberof app.log
     * @name debug
     * @param {string} message
     * @param {*} [payload]
     */
    [LEVEL_DEBUG]: log(LEVEL_DEBUG),
    /**
     * @memberof app.log
     * @name trace
     * @param {string} message
     * @param {*} [payload]
     */
    [LEVEL_TRACE]: log(LEVEL_TRACE),
    /**
     * @memberof app.log
     * @name info
     * @param {string} message
     * @param {*} [payload]
     */
    [LEVEL_INFO]: log(LEVEL_INFO),
    /**
     * @memberof app.log
     * @name warn
     * @param {string} message
     * @param {*} [payload]
     */
    [LEVEL_WARN]: log(LEVEL_WARN),
    /**
     * @memberof app.log
     * @name error
     * @param {string} message
     * @param {*} [payload]
     */
    [LEVEL_ERROR]: log(LEVEL_ERROR),
    /**
     * @memberof app.log
     * @name fatal
     * @param {string} message
     * @param {*} [payload]
     */
    [LEVEL_FATAL]: log(LEVEL_FATAL)
  };
  let usePluginLogger;

  app.on('plugin.logger.use', () => usePluginLogger = true);
  app.on('plugin.logger.unuse', () => usePluginLogger = false);

  process.on('uncaughtException', logger.error);

  return logger;

  /**
   * @param {string} level
   * @returns {function(string, payload)}
   */
  function log(level) {
    return (message, payload) => {
      if (LEVELS[logger.level] < LEVELS[level]) {
        return logger;
      }

      if (usePluginLogger) {
        app.emit('log', { level, message, payload });
        app.emit(`log.${ level }`, { level, message, payload });
      } else {
        const args = [`${ level }\t`, message];

        if (!!payload) {
          args.push(JSON.stringify(payload, '', 4));
        }

        switch (level) {
          case LEVEL_ERROR:
          case LEVEL_FATAL:
            console.error(...args);
            break;
          case LEVEL_WARN:
            console.warn(...args);
            break;
          default:
            console.log(...args);
        }
      }

      return logger;
    };
  }
};
//# sourceMappingURL=log.js.map