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
  let transports = {
    http: null
  };

  app.on('plugin.transport', (type, listen) => transports[ type ] = listen);

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

    // Проверяем наличие транспорта для сервера
    if (useServer && typeof transport[ transport ] !== 'function') {
      // если не найден транспорт - добавим в плагины транспорт по умолчанию
      app.use(NodeHttpPlugin({ ...otherSettings }));
    }

    promise
      // Запустим всех подписчиков на этап инициализации
      .then(() => runInitSubscribers(app))
      // Запустим прослушку транспорта для сервера
      .then(() => {
        if(!useServer) {
          return Promise.resolve();
        }

        return transports[ transport ]();
      })
      .then(() => runDeferred.resolve(app))
      .catch(runDeferred.reject);

    return runDeferred.promise;
  };
}