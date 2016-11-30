
export const LEVEL_ALL = 'all';
export const LEVEL_OFF = 'off';
export const LEVEL_INFO = 'info';
export const LEVEL_TRACE = 'trace';
export const LEVEL_DEBUG = 'debug';
export const LEVEL_WARN = 'warn';
export const LEVEL_ERROR = 'error';
export const LEVEL_FATAL = 'fatal';
/**
 * @name LEVELS
 * @type {Object<string, number>}
 * @enum {number}
 */
export const LEVELS = {
  [ LEVEL_ALL ]: 0,

  [ LEVEL_INFO  ]: 10,
  [ LEVEL_TRACE ]: 20,
  [ LEVEL_DEBUG ]: 30,
  [ LEVEL_WARN  ]: 40,
  [ LEVEL_ERROR ]: 50,
  [ LEVEL_FATAL ]: 60,

  [ LEVEL_OFF ]: 100
};

/**
 * @param {app} app
 * @param { string } [level]
 * @returns {object}
 */
export default (app, { level = LEVEL_DEBUG } = {}) => {
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
     * @param {...*} [payload]
     */
    [ LEVEL_DEBUG ]: log(LEVEL_DEBUG),
    /**
     * @memberof app.log
     * @name trace
     * @param {string} message
     * @param {...*} [payload]
     */
    [ LEVEL_TRACE ]: log(LEVEL_TRACE),
    /**
     * @memberof app.log
     * @name info
     * @param {string} message
     * @param {...*} [payload]
     */
    [ LEVEL_INFO ] : log(LEVEL_INFO),
    /**
     * @memberof app.log
     * @name warn
     * @param {string} message
     * @param {...*} [payload]
     */
    [ LEVEL_WARN ] : log(LEVEL_WARN),
    /**
     * @memberof app.log
     * @name error
     * @param {string} message
     * @param {...*} [payload]
     */
    [ LEVEL_ERROR ]: log(LEVEL_ERROR),
    /**
     * @memberof app.log
     * @name fatal
     * @param {string} message
     * @param {...*} [payload]
     */
    [ LEVEL_FATAL ]: log(LEVEL_FATAL)
  };

  return logger;

  /**
   * @param {string} level
   * @returns {function(string, ...[*])}
   */
  function log(level) {
    return (message, ...payload) => {
      if (LEVELS[ logger.level ] < LEVELS[ level ]) {
        return logger;
      }

      app
        .act({ cmd: 'logger', level, message, payload })
        .catch(result => console.log(`${ level }\t${ message }`, ...payload));

      return logger;
    };
  }
}