'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = fetch;

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _makeRequest = require('./../../../utils/make-request');

var _constants = require('./../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const ERROR_CODE_PREFIX = 'error.http.client';

function fetch(app, _ref) {
  let name = _ref.name,
      settings = _ref.settings;
  let url = settings.url;
  var _settings$headers = settings.headers;
  let headers = _settings$headers === undefined ? {} : _settings$headers;
  var _settings$prefix = settings.prefix;
  let prefix = _settings$prefix === undefined ? _constants.CLIENT_PREFIX : _settings$prefix,
      ssh = settings.ssh,
      agent = settings.agent;


  if (agent) {
    app.log.trace(`Используется SSH TUNNEL: ${ ssh.username }@${ ssh.host }:${ ssh.port }`);
    app.log.debug('Настройки SSH TUNNEL:', ssh);
    agent.on('error', app.log.error).on('verify', (fingerprint, callback) => {
      app.log.info(`Server fingerprint is ${ fingerprint }`);
      callback(); // pass an error to indicate a bad fingerprint
    });
  }

  return (request, route) => new Promise((resolve, reject) => {
    const api = request.api,
          transport = request.transport,
          req = request.request,
          msg = _objectWithoutProperties(request, ['api', 'transport', 'request']);

    (0, _nodeFetch2.default)(url + prefix, {
      agent,
      method: 'POST',
      timeout: _constants.API_TIMEOUT,
      headers: _extends({
        'Content-Type': _constants.CLIENT_CONTENT_TYPE
      }, headers, {

        [_constants.CLIENT_TRANSPORT_HEADER]: _jsonwebtoken2.default.sign({ transport }, _constants.CLIENT_SECRET),
        [_constants.CLIENT_REQUEST_HEADER]: _jsonwebtoken2.default.sign({ request: { id: req.id } }, _constants.CLIENT_SECRET)
      }),
      body: JSON.stringify((0, _makeRequest.clear)(msg))
    }).then(handleSuccess({ request, resolve, reject }), handleError({ request, reject }));
  });
}

function handleSuccess(_ref2) {
  let request = _ref2.request,
      resolve = _ref2.resolve,
      reject = _ref2.reject;

  return response => {
    const _handleError = handleError({ request, reject });

    response.json().then(
    // Если ответ корректно распарсился
    function () {
      let json = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      // Разберем ответ - данная структура обязательна для клиентских ответов
      const status = json[_constants.RESPONSE_PROPERTY_STATUS],
            result = json[_constants.RESPONSE_PROPERTY_RESULT];

      // Если статус результата - успех, то завершим работу вернув результат

      if (status === _constants.RESPONSE_STATUS_SUCCESS) {
        return resolve(result);
      }

      // Если статус результата - ошибка, то вызовем обработчик ошибок
      if (status === _constants.RESPONSE_STATUS_ERROR) {
        return _handleError(result);
      }

      // Если что-то непонятное - вызовем обработчик с ошибкой
      return _handleError({
        code: `${ ERROR_CODE_PREFIX }/unknown.response.structure`,
        message: `Ответ клиента неизвестной структуры`,
        details: json
      });
    },
    // Если ошибка парсинга - вызовем обработчик ошибок
    _handleError);
  };
}

function handleError(_ref3) {
  let request = _ref3.request,
      reject = _ref3.reject;

  return e => {
    let error;

    switch (e.code) {
      // Возникает когда нет сервиса к которому обращаемся
      case 'ECONNREFUSED':
        error = {
          code: `${ ERROR_CODE_PREFIX }/service.not.available`,
          message: `Клиент по запросу (${ request.id }) недоступен`
        };
        break;
      default:
        error = {
          code: e.code || e.status,
          message: e.message || e.statusText,
          details: e.details || undefined
        };
    }

    reject(error);
  };
}
//# sourceMappingURL=fetch.js.map