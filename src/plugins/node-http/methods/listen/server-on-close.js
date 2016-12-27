import os from 'os';
import WrappedError from 'error/wrapped';
const ERROR_TYPE = 'micro.plugin.http-node';

const ServerCloseInternalError = WrappedError({
  message: [
    '{name} - Внутренняя ошибка остановки сервера',
    '{name} - {origMessage}',
  ].join(os.EOL),
  type: `${ ERROR_TYPE }.server.close.internal`
});

export default function serverOnClose(server, app, settings, meta) {
  const { plugin:{ host, port } } = meta;

  return () => new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) {
        let error = ServerCloseInternalError(err);
        app.log.error(error.message, meta);
        return reject(error);
      }

      app.log.info(`Остановлен Node Http сервер (host=${ host },port=${ port })`, meta);
      resolve();
    });
  });
}