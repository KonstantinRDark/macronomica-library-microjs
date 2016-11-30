import defer from './../utils/defer';
import NodeHttpPlugin from './../plugins/node-http';
import runInitSubscribers from './../utils/run-init-subscribers';

/**
 * @param {app} app                                 // Экземпляр библиотеки
 * @returns {function:Promise}
 */
export default function run(app) {
  // Ссылка на обещание запуска
  let runDeferred;
  /**
   * @namespace app.run
   * @param {function} [cb]
   * @returns {Promise<app>}
   */
  return cb => {
    const useServer = !!app.settings;
    const { transport = 'http', ...otherSettings } = app.settings || {};

    if (runDeferred) {
      return runDeferred.promise;
    }

    runDeferred = defer(cb);
    let promise = Promise.resolve();

    if (useServer) {
      promise = promise
          // Проверяем наличие транспорта для сервера
          .then(() => app.act({ transport }))
          // если не найден транспорт - добавим в плагины транспорт по умолчанию
          .catch(() => app.use(NodeHttpPlugin(otherSettings)));
    }

    promise
      // Запустим всех подписчиков на этап инициализации
      .then(() => runInitSubscribers(app))
      // Запустим прослушку транспорта для сервера
      .then(() => useServer
        ? app.act({ transport, cmd: 'listen' })
        : Promise.resolve())
      .then(() => {
        return runDeferred.resolve(app);
      })
      .catch(runDeferred.reject);

    return runDeferred.promise;
  };
}