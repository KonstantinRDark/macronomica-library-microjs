'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = listenHttp;

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _buffer = require('buffer');

var _buffer2 = _interopRequireDefault(_buffer);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _makeRequest = require('./../../../utils/make-request');

var _makeRequest2 = _interopRequireDefault(_makeRequest);

var _iterate = require('./../../../utils/iterate');

var _iterate2 = _interopRequireDefault(_iterate);

var _constants = require('./../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const jsonBodyParser = _bodyParser2.default.json();
const urlencodedParser = _bodyParser2.default.urlencoded({ extended: false });
const type = 'http';

const preprocessors = [jsonBodyParser, urlencodedParser];

function listenHttp(app, plugin, onClose) {
  let settings = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  return function listenHttpRoute() {
    const server = _http2.default.createServer(handleRequest);
    var _settings$host = settings.host;
    const host = _settings$host === undefined ? _constants.SERVER_HOST : _settings$host;
    var _settings$port = settings.port;
    const port = _settings$port === undefined ? _constants.SERVER_PORT : _settings$port;


    app.log.debug('Настройки HTTP сервера', { plugin: { host, port } });
    server.on('error', app.log.error);
    server.on('connection', socket => {
      socket.setNoDelay(); // Отключаем алгоритм Нагла.
    });

    onClose(() => new Promise((resolve, reject) => {
      server.close(err => {
        if (err && err.message !== 'Not running') {
          return reject(err);
        }
        app.log.info('Остановлен Node Http сервер', { plugin: { host, port } });
        resolve();
      });
    }), 'unshift');

    return new Promise((resolve, reject) => {
      server.listen(port, host, err => {
        if (err) {
          return reject(err);
        }
        app.log.info('Запущен Node Http сервер', { plugin: { host, port } });
        resolve();
      });
    });

    function handleRequest(req, res, next) {
      const errorMessage = `${ _constants.RESPONSE_STATUS_ERROR }.transport.http.listen`;
      const error404Message = `404:${ errorMessage }`;

      req._originalUrl = req.url;
      req.url = _url2.default.parse(req.url);
      req.query = _qs2.default.parse(req.url.query);

      if (req.url.pathname !== _constants.SERVER_PREFIX) {
        app.log.error(`[${ error404Message }/url.not.found]`, {
          error: req.url
        });
        return response404(res, `${ error404Message }/url.not.found`);
      }

      (0, _iterate2.default)(req.method === 'POST' ? preprocessors : [], req, res, err => {
        if (err) {
          app.log.error(`[${ error404Message }/preprocessors.parse]`, { error: err });
          return response404(res, `${ error404Message }/preprocessors.parse`);
        }
        const transport = {
          type,
          origin: req.headers['user-agent'],
          method: req.method,
          time: Date.now()
        };

        if (_constants.SERVER_TRANSPORT_HEADER in req.headers) {
          Object.assign(transport, _jsonwebtoken2.default.verify(req.headers[_constants.SERVER_TRANSPORT_HEADER], _constants.SERVER_SECRET).transport);
        }

        transport.trace = [...(transport.trace || []), app.name];

        const pin = _extends({}, req.body || {}, req.query);
        const request = (0, _makeRequest2.default)(app, _extends({
          transport,
          request: _constants.SERVER_REQUEST_HEADER in req.headers ? _jsonwebtoken2.default.verify(req.headers[_constants.SERVER_REQUEST_HEADER], _constants.SERVER_SECRET).request : null
        }, pin));

        if (pin.role === 'plugin') {
          app.log.warn(`Вызов приватного метода`, { pin, request });
          app.log.info(`[${ error404Message }/call.private.method]`, {
            error: error404Message,
            pin, request
          });
          return response404(res, {});
        }

        app.act(request, (error, result) => {
          const code = error ? 500 : 200;
          const level = error ? 'error' : 'info';
          const status = error ? _constants.RESPONSE_STATUS_ERROR : _constants.RESPONSE_STATUS_SUCCESS;
          const meta = {
            request: request.request,
            pin
          };

          if (!!error && error.code === 'error.common/act.not.found') {
            request.duration();
            app.log.error(`[${ error404Message }/act.not.found]`, _extends({}, meta, { error }));
            return response404(res, error);
          }

          const outJson = JSON.stringify({
            [_constants.RESPONSE_PROPERTY_STATUS]: status,
            [_constants.RESPONSE_PROPERTY_RESULT]: error || result
          });

          res.writeHead(code, {
            'Content-Type': 'application/json',
            // 'Cache-Control' : 'private, max-age=0, no-cache, no-store',
            'Content-Length': _buffer2.default.Buffer.byteLength(outJson)
          });

          const message = `[${ code }:${ req.method }:${ status }] ${ request.duration() }ms`;

          if (code === 500) {
            meta.error = error;
          }

          app.log[level](message, meta);

          res.end(outJson);
        });
      });
    }
  };
}

function response404(res, result) {
  const json = JSON.stringify({
    [_constants.RESPONSE_PROPERTY_STATUS]: _constants.RESPONSE_STATUS_ERROR,
    [_constants.RESPONSE_PROPERTY_RESULT]: result
  });

  res.writeHead(404, {
    'Content-Type': 'application/json',
    'Cache-Control': 'private, max-age=0, no-cache, no-store',
    'Content-Length': _buffer2.default.Buffer.byteLength(json)
  });

  res.statusMessage = 'Not found';
  res.end(json);
}
//# sourceMappingURL=listen.js.map