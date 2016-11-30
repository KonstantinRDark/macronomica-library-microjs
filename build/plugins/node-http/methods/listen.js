'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = listenHttp;

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _buffer = require('buffer');

var _buffer2 = _interopRequireDefault(_buffer);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _iterate = require('./../../../utils/iterate');

var _iterate2 = _interopRequireDefault(_iterate);

var _constants = require('./../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var jsonBodyParser = _bodyParser2.default.json();
var urlencodedParser = _bodyParser2.default.urlencoded({ extended: false });
var type = 'http';

var preprocessors = [jsonBodyParser, urlencodedParser];

function listenHttp(app, plugin, onClose, _ref) {
  var _ref$host = _ref.host,
      host = _ref$host === undefined ? _constants.SERVER_HOST : _ref$host,
      port = _ref.port;

  return function listenHttpRoute() {
    if (['localhost', '0.0.0.0'].includes(port)) {
      port = _constants.SERVER_PORT;
    }
    port = port || _constants.SERVER_PORT;

    var server = _http2.default.createServer(handleRequest);

    server.on('error', app.log.error);
    server.on('connection', function (socket) {
      socket.setNoDelay(); // Отключаем алгоритм Нагла.
    });

    onClose(function () {
      return new Promise(function (resolve, reject) {
        server.close(function (err) {
          if (err && err.message !== 'Not running') {
            return reject(err);
          }

          resolve();
        });
      });
    });

    return new Promise(function (resolve, reject) {
      server.listen(port, host, function (err) {
        if (err) {
          return reject(err);
        }
        app.log.info('Запущен Node Http сервер', { host: host, port: port });
        resolve();
      });
    });

    function handleRequest(req, res) {
      req._originalUrl = req.url;
      req.url = _url2.default.parse(req.url);
      req.query = _qs2.default.parse(req.url.query);

      if (req.url.pathname !== _constants.SERVER_PREFIX) {
        var _JSON$stringify;

        var error = {
          code: 'error.transport.http.listen/url.not.found',
          message: 'Не корректный маршрут запроса'
        };

        var outJson = JSON.stringify((_JSON$stringify = {}, _defineProperty(_JSON$stringify, _constants.RESPONSE_PROPERTY_STATUS, _constants.RESPONSE_STATUS_ERROR), _defineProperty(_JSON$stringify, _constants.RESPONSE_PROPERTY_RESULT, error), _JSON$stringify));

        res.writeHead(404, {
          'Content-Type': 'application/json',
          'Cache-Control': 'private, max-age=0, no-cache, no-store',
          'Content-Length': _buffer2.default.Buffer.byteLength(outJson)
        });
        res.statusMessage = 'Not found';
        return res.end(outJson);
      }

      (0, _iterate2.default)(req.method === 'POST' ? preprocessors : [], req, res, function (err) {
        if (err) {
          return app.logger.error(err);
        }
        var pin = _extends({}, req.body || {}, req.query, {
          transport: {
            type: type,
            origin: req.headers['user-agent'],
            time: Date.now()
          }
        });

        app.act(pin, function (error, result) {
          var _JSON$stringify2;

          var code = error ? 500 : 200;
          var status = error ? _constants.RESPONSE_STATUS_ERROR : _constants.RESPONSE_STATUS_SUCCESS;

          var outJson = JSON.stringify((_JSON$stringify2 = {}, _defineProperty(_JSON$stringify2, _constants.RESPONSE_PROPERTY_STATUS, status), _defineProperty(_JSON$stringify2, _constants.RESPONSE_PROPERTY_RESULT, error || result), _JSON$stringify2));

          res.writeHead(code, {
            'Content-Type': 'application/json',
            // 'Cache-Control' : 'private, max-age=0, no-cache, no-store',
            'Content-Length': _buffer2.default.Buffer.byteLength(outJson)
          });

          res.end(outJson);
        });
      });
    }
  };
}
//# sourceMappingURL=listen.js.map