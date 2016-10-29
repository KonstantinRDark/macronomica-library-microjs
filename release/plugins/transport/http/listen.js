'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

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

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var jsonBodyParser = _bodyParser2.default.json();
var urlencodedParser = _bodyParser2.default.urlencoded({ extended: false });

var preprocessors = [jsonBodyParser, urlencodedParser];

exports.default = function (micro, plugin, _ref) {
  var type = _ref.type,
      host = _ref.host,
      port = _ref.port;

  if (['localhost', '0.0.0.0'].includes(port)) {
    port = _constants.SERVER_PORT;
  }
  port = port || _constants.SERVER_PORT;
  host = host || _constants.SERVER_HOST;

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
      micro.logger.warn(error.message, {
        payload: {
          code: error.code,
          url: req._originalUrl
        }
      });

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
        return micro.logger.error(err);
      }
      var pin = _extends({}, req.body || {}, req.query, {
        transport: {
          type: type,
          origin: req.headers['user-agent'],
          time: Date.now()
        }
      });

      micro.api.act(pin, function (error, result) {
        var _JSON$stringify2;

        var code = error ? 500 : 200;
        var status = error ? _constants.RESPONSE_STATUS_ERROR : _constants.RESPONSE_STATUS_SUCCESS;

        var outJson = JSON.stringify((_JSON$stringify2 = {}, _defineProperty(_JSON$stringify2, _constants.RESPONSE_PROPERTY_STATUS, status), _defineProperty(_JSON$stringify2, _constants.RESPONSE_PROPERTY_RESULT, error || result), _JSON$stringify2));
        res.writeHead(code, {
          'Content-Type': 'application/json',
          // 'Cache-Control' : 'private, max-age=0, no-cache, no-store',
          'Content-Length': _buffer2.default.Buffer.byteLength(outJson)
        });
        // res.statusMessage = 'Not found';
        res.end(outJson);
      });
    });
  }

  var server = type === 'https' ? _https2.default.createServer(handleRequest) : _http2.default.createServer(handleRequest);

  server.on('error', micro.die);
  server.on('connection', function (socket) {
    socket.setNoDelay(); // Отключаем алгоритм Нагла.
  });

  return {
    close: function close() {
      return new Promise(function (resolve, reject) {
        server.close(function (err) {
          if (err && err.message !== 'Not running') {
            return reject(err);
          }

          micro.logger.info('\u041E\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D \u0441\u0435\u0440\u0432\u0435\u0440 \u043F\u043E \u0430\u0434\u0440\u0435\u0441\u0443: ' + type + '://' + host + ':' + port + _constants.SERVER_PREFIX, {
            id: plugin.id
          });
          resolve();
        });
      });
    },
    listen: function listen() {
      return new Promise(function (resolve, reject) {

        server.listen(port || _constants.SERVER_PORT, host || _constants.SERVER_HOST, function (err) {
          if (err) {
            return reject(err);
          }

          micro.logger.info('\u0417\u0430\u043F\u0443\u0449\u0435\u043D \u0441\u0435\u0440\u0432\u0435\u0440 \u043F\u043E \u0430\u0434\u0440\u0435\u0441\u0443: ' + type + '://' + host + ':' + port + _constants.SERVER_PREFIX, {
            id: plugin.id
          });

          resolve();
        });
      });
    }
  };
};
//# sourceMappingURL=listen.js.map
