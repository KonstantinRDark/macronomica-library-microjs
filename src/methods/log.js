import Util from 'util';
import {
  LEVEL_DEFAULT,
  LEVEL_ALL,
  LEVEL_OFF,
  LEVEL_INFO,
  LEVEL_TRACE,
  LEVEL_DEBUG,
  LEVEL_WARN,
  LEVEL_ERROR,
  LEVEL_FATAL,
} from './../constants';

/**
 * @name LEVELS
 * @type {Object<string, number>}
 * @enum {number}
 */
export const LEVELS = {
  [ LEVEL_OFF ]: 0,

  [ LEVEL_FATAL ]: 10,
  [ LEVEL_ERROR ]: 20,
  [ LEVEL_WARN  ]: 30,
  [ LEVEL_INFO  ]: 40,
  [ LEVEL_TRACE ]: 50,
  [ LEVEL_DEBUG ]: 60,

  [ LEVEL_ALL ]: 100
};

/**
 * @param {app} app
 * @param { string } [level]
 * @returns {object}
 */
export default (app, { level = LEVEL_DEFAULT } = {}) => {
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
     * @param {string|Array<string>} message
     * @param {*} [payload]
     */
    [ LEVEL_DEBUG ]: log(LEVEL_DEBUG),
    /**
     * @memberof app.log
     * @name trace
     * @param {string|Array<string>} message
     * @param {*} [payload]
     */
    [ LEVEL_TRACE ]: log(LEVEL_TRACE),
    /**
     * @memberof app.log
     * @name info
     * @param {string|Array<string>} message
     * @param {*} [payload]
     */
    [ LEVEL_INFO ] : log(LEVEL_INFO),
    /**
     * @memberof app.log
     * @name warn
     * @param {string|Array<string>} message
     * @param {*} [payload]
     */
    [ LEVEL_WARN ] : log(LEVEL_WARN),
    /**
     * @memberof app.log
     * @name error
     * @param {string|Array<string>} message
     * @param {*} [payload]
     */
    [ LEVEL_ERROR ]: log(LEVEL_ERROR),
    /**
     * @memberof app.log
     * @name fatal
     * @param {string|Array<string>} message
     * @param {*} [payload]
     */
    [ LEVEL_FATAL ]: log(LEVEL_FATAL)
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
      if (LEVELS[ logger.level ] < LEVELS[ level ]) {
        return logger;
      }

      if (level === LEVEL_FATAL) {
        const error = message instanceof Error ? message : new Error(message);
        let stack = error.stack || '';
        stack = stack
          .replace(/^.*?\n/, '\n')
          .replace(/\n/g, '\n          ')
        ;

        message = [
          '##############################################################################################',
          `# Fatal Error`,
          '# Instance  : ' + app.id,
          '# Started At: ' + app.time.started,
          '# =========================================================================================== ',
          '  Message   : ' + error.message,
          '  Code      : ' + error.code,
          '  Payload   : ' + Util.inspect(payload, { depth: null }),
          '  Details   : ' + Util.inspect(error.details, { depth: null }),
          '  When      : ' + (new Date()).toISOString(),
          '  Stack     : ' + stack,
          '  Node      : ' + Util.inspect(process.versions).replace(/\s+/g, ' '),
          '              ' + Util.inspect(process.features).replace(/\s+/g, ' '),
          '              ' + Util.inspect(process.moduleLoadList).replace(/\s+/g, ' '),
          '  Process   : ',
          '              pid=' + process.pid,
          '              arch=' + process.arch,
          '              platform=' + process.platform,
          '              path=' + process.execPath,
          '              argv=' + Util.inspect(process.argv).replace(/\n/g, ''),
          '              env=' + Util.inspect(process.env).replace(/\n/g, ''),
          '##############################################################################################'
        ];
      }

      if (level === LEVEL_ERROR && message instanceof Error) {
        const error = message;
        let stack = error.stack || '';
        stack = stack
          .replace(/^.*?\n/, '\n')
          .replace(/\n/g, '\n          ')
        ;

        message = [
          '##############################################################################################',
          `# Error`,
          '# =========================================================================================== ',
          '  Instance  : ' + app.id,
          '  Message   : ' + error.message,
          '  Code      : ' + error.code,
          '  Payload   : ' + Util.inspect(payload, { depth: null }),
          '  Details   : ' + Util.inspect(error.details, { depth: null }),
          '  When      : ' + (new Date()).toISOString(),
          '  Stack     : ' + stack,
          '  Node      : ' + Util.inspect(process.versions).replace(/\s+/g, ' '),
          '              ' + Util.inspect(process.features).replace(/\s+/g, ' '),
          '              ' + Util.inspect(process.moduleLoadList).replace(/\s+/g, ' '),
          '  Process   : ',
          '              pid=' + process.pid,
          '              arch=' + process.arch,
          '              platform=' + process.platform,
          '              path=' + process.execPath,
          '              argv=' + Util.inspect(process.argv).replace(/\n/g, ''),
          '              env=' + Util.inspect(process.env).replace(/\n/g, ''),
          '##############################################################################################'
        ];
      }

      if (Array.isArray(message)) {
        message.forEach(emitOne);
      } else {
        emitOne(message);
      }

      return logger;

      function emitOne(message) {
        if (usePluginLogger) {
          app.emit('log', { level, message, payload });
          app.emit(`log.${ level }`, { level, message, payload });
        } else {
          const args = [ `${ level }: [${ app.id }]`, message ];

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
      }
    };
  }
}