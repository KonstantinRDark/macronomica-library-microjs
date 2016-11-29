import defer from './../utils/defer';
import NodeHttpPlugin from './../plugins/node-http';
import runInitSubscribers from './../utils/run-init-subscribers';

/**
 * @param {object} microjs                          // Экземпляр библиотеки
 * @param {{ run: [], end: [] }} subscribers        // Список подписчиков
 * @param {{ run: promise, end: promise }} promises // Список ожиданий
 * @param {object} settings                         // Настройки для запуска сервера
 * @returns {function(?function):Promise}
 */
export default function run(microjs, { subscribers, promises }, settings) {
  const useServer = !!settings;
  const { transport = 'http', ...otherSettings } = settings || {};

  // Ссылка на обещание запуска
  let runDeferred;

  return cb => {
    if (runDeferred) { return runDeferred.promise }

    runDeferred = defer(cb);
    let promise = Promise.resolve();

    if (useServer) {
      promise = promise
          // Проверяем наличие транспорта для сервера
          .then(() => microjs.act({ transport }))
          // если не найден транспорт - добавим в плагины транспорт по умолчанию
          .catch(() => microjs.use(NodeHttpPlugin(otherSettings)));
    }

    promise
      // Запустим всех подписчиков на этап инициализации
      .then(() => runInitSubscribers(microjs, subscribers.run, subscribers.end))
      // Запустим прослушку транспорта для сервера
      .then(() => useServer
        ? microjs.act({ transport, cmd: 'listen' })
        : Promise.resolve())
      .then(() => runDeferred.resolve(microjs))
      .catch(runDeferred.reject);

    return runDeferred.promise;
  };
}