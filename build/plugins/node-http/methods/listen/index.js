'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = listenHttp;

var _wrapped = require('error/wrapped');

var _wrapped2 = _interopRequireDefault(_wrapped);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _serverOnClose = require('./server-on-close');

var _serverOnClose2 = _interopRequireDefault(_serverOnClose);

var _serverOnListen = require('./server-on-listen');

var _serverOnListen2 = _interopRequireDefault(_serverOnListen);

var _handleRequest = require('./handle-request');

var _handleRequest2 = _interopRequireDefault(_handleRequest);

var _constants = require('./../../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ERROR_TYPE = 'micro.plugin.http-node';

const InternalError = (0, _wrapped2.default)({
  message: '{name} - {origMessage}',
  type: `${ ERROR_TYPE }.internal`
});

function listenHttp(app, plugin, onClose) {
  let settings = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  return function listenHttpRoute() {
    try {
      var _settings$host = settings.host;
      const host = _settings$host === undefined ? _constants.SERVER_HOST : _settings$host;
      var _settings$port = settings.port;
      const port = _settings$port === undefined ? _constants.SERVER_PORT : _settings$port;

      const meta = { plugin: { host, port } };
      const server = _http2.default.createServer((0, _handleRequest2.default)(app, settings, meta));

      app.log.debug('Настройки HTTP сервера', meta);
      // поямаем ошибки сервера
      server.on('error', handlerError(app));
      // Отключаем алгоритм Нагла.
      server.on('connection', socket => socket.setNoDelay());

      onClose((0, _serverOnClose2.default)(server, app, settings, meta), 'unshift');

      return (0, _serverOnListen2.default)(server, app, settings, meta);
    } catch (err) {
      return _promise2.default.reject(handlerError(app)(err));
    }
  };
}

function handlerError(app) {
  return err => {
    let error = InternalError(err);
    app.log.error(error.message, { error });
    return error;
  };
}
//# sourceMappingURL=index.js.map