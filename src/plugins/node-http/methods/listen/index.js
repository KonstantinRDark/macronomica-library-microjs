import WrappedError from 'error/wrapped';

import http from 'http';
import serverOnClose from './server-on-close';
import serverOnListen from './server-on-listen';
import handleRequest from './handle-request';
import {
  SERVER_HOST,
  SERVER_PORT
} from './../../constants';

const ERROR_TYPE = 'micro.plugin.http-node';

const InternalError = WrappedError({
  message: '{name} - {origMessage}',
  type   : `${ ERROR_TYPE }.internal`
});

export default function listenHttp(app, plugin, onClose, settings = {}) {
  return function listenHttpRoute() {
    try {
      const { host = SERVER_HOST, port = SERVER_PORT } = settings;
      const meta = { plugin: { host, port } };
      const server = http.createServer(handleRequest(app, settings, meta));

      app.log.debug('Настройки HTTP сервера', meta);
      // поямаем ошибки сервера
      server.on('error', handlerError(app));
      // Отключаем алгоритм Нагла.
      server.on('connection', (socket) => socket.setNoDelay());

      onClose(serverOnClose(server, app, settings, meta), 'unshift');

      return serverOnListen(server, app, settings, meta);
    } catch(err) {
      return Promise.reject(handlerError(app)(err));
    }
  };
}

function handlerError(app) {
  return err => {
    let error = InternalError(err);
    app.log.error(error.message, { error });
    return error;
  }
}