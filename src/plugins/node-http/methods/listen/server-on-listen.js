import os from 'os';
import WrappedError from 'error/wrapped';
const ERROR_TYPE = 'micro.plugin.http-node';

const ServerListenInternalError = WrappedError({
  message: [
    '{name} - Внутренняя ошибка запуска сервера',
    '{name} - {origMessage}',
  ].join(os.EOL),
  type: `${ ERROR_TYPE }.server.listen.internal`
});

export default function serverOnListen(server, app, settings, meta) {
  const { plugin:{ host, port } } = meta;

  return new Promise((resolve, reject) => {
    server.listen(port, host, (err) => {

      if (err) {
        let error = ServerListenInternalError(err);
        app.log.error(error.message, meta);
        return reject(error);
      }

      app.log.info(`Запущен Node Http сервер (host=${ host },port=${ port })`, {
        plugin: { host, port }
      });
      resolve();
    });
  });
};