
export const LEVEL_ALL = 'all';
export const LEVEL_OFF = 'off';
export const LEVEL_INFO = 'info';
export const LEVEL_TRACE = 'trace';
export const LEVEL_DEBUG = 'debug';
export const LEVEL_WARN = 'warn';
export const LEVEL_ERROR = 'error';
export const LEVEL_FATAL = 'fatal';
export const LEVELS = {
  LEVEL_ALL: 0,

  LEVEL_INFO : 10,
  LEVEL_TRACE: 20,
  LEVEL_DEBUG: 30,
  LEVEL_WARN : 40,
  LEVEL_ERROR: 50,
  LEVEL_FATAL: 60,

  LEVEL_OFF: 100
};

export default function log(microjs, { level = LEVEL_DEBUG } = {}) {
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
  const logger = {};

  return Object.assign(logger, {
    level,
    LEVELS,
    [ LEVEL_DEBUG ]: log(LEVEL_DEBUG),
    [ LEVEL_TRACE ]: log(LEVEL_TRACE),
    [ LEVEL_INFO ] : log(LEVEL_INFO),
    [ LEVEL_WARN ] : log(LEVEL_WARN),
    [ LEVEL_ERROR ]: log(LEVEL_ERROR),
    [ LEVEL_FATAL ]: log(LEVEL_FATAL),
  });

  function log(level) {
    return (message, ...payload) => {
      if (LEVELS[ logger.level ] < LEVELS[ level ]) {
        return logger;
      }

      microjs
        .act({ cmd: 'logger', level, message, payload })
        .catch(result => console.log(`${ level }\t${ message }`, ...payload));

      return logger;
    };
  }
}