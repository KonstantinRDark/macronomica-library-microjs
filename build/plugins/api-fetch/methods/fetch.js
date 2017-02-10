'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports.default = fetch;

var _wrapped = require('error/wrapped');

var _wrapped2 = _interopRequireDefault(_wrapped);

var _typed = require('error/typed');

var _typed2 = _interopRequireDefault(_typed);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _makeRequest = require('./../../../utils/make-request');

var _constants = require('./../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PREFIX_LOG = 'micro.plugins.fetch';

const InternalError = (0, _wrapped2.default)({
  message: ['{name}: Внутренняя ошибка по запросу [{request}]{url}', '{name}: {origMessage}'].join('\n'),
  type: `${ PREFIX_LOG }.internal`,
  url: null,
  request: null
});

const ServiceNotAvailableError = (0, _wrapped2.default)({
  message: ['{name}: Сервис недоступен по запросу [{request}]{url}', '{name}: {origMessage}'].join('\n'),
  type: `${ PREFIX_LOG }.service.not.available`,
  url: null,
  request: null
});

const ParseResponseError = (0, _wrapped2.default)({
  message: ['{name}: Ошибка парсинга ответа по запросу [{request}]{url}', '{name}: {origMessage}'].join('\n'),
  type: `${ PREFIX_LOG }.parse.response`,
  url: null,
  request: null
});

const TimeoutError = (0, _typed2.default)({
  message: '{name}: Превышено время ожидания (timeout={timeout}) запроса [{request}]{url}',
  type: `${ PREFIX_LOG }.timeout`,
  timeout: _constants.API_TIMEOUT,
  code: 504
});

function fetch(app, _ref) {
  let name = _ref.name,
      settings = _ref.settings;
  let url = settings.url;
  var _settings$headers = settings.headers;
  let outerHeaders = _settings$headers === undefined ? {} : _settings$headers;
  var _settings$prefix = settings.prefix;
  let prefix = _settings$prefix === undefined ? _constants.CLIENT_PREFIX : _settings$prefix,
      ssh = settings.ssh,
      agent = settings.agent;


  if (agent) {
    app.log.trace(`Используется SSH TUNNEL: ${ ssh.username }@${ ssh.host }:${ ssh.port }`);
    app.log.debug('Настройки SSH TUNNEL:', ssh);
    agent.on('error', error => app.log.error((0, _wrapped2.default)({
      message: '{name}: {origMessage}',
      type: 'micro.plugin.fetch.ssh.internal'
    })(error)));
  }

  return (request, route) => {
    const api = request.api,
          transport = request.transport,
          msg = (0, _objectWithoutProperties3.default)(request, ['api', 'transport']);

    const body = (0, _makeRequest.clear)(msg);
    const meta = {
      api,
      transport,
      request: request.request,
      useAgent: !!agent
    };
    const headers = (0, _extends3.default)({
      'Content-Type': _constants.CLIENT_CONTENT_TYPE,
      'Referer': app.name,
      'User-Agent': transport.origin
    }, outerHeaders, {

      [_constants.CLIENT_TRANSPORT_HEADER]: getSignTransport(transport),
      [_constants.CLIENT_REQUEST_HEADER]: getSignRequest(meta.request)
    });
    const options = {
      agent,
      headers,
      method: 'POST',
      timeout: _constants.API_TIMEOUT,
      body: (0, _stringify2.default)(body)
    };
    request.duration();
    request.log.trace(`${ PREFIX_LOG }.in`, (0, _extends3.default)({ body }, meta));

    try {
      return (0, _nodeFetch2.default)(url + prefix, options).then(handleSuccess(request, meta), handleError(request, meta));
    } catch (e) {
      return handleError(request, meta)(e);
    }
  };
}

function getSignTransport() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  let transport = (0, _objectWithoutProperties3.default)(_ref2, []);

  return _jsonwebtoken2.default.sign({ transport: (0, _extends3.default)({}, transport) }, _constants.CLIENT_SECRET);
}

function getSignRequest() {
  var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  let time = _ref3.time,
      request = (0, _objectWithoutProperties3.default)(_ref3, ['time']);

  return _jsonwebtoken2.default.sign({ request: (0, _extends3.default)({}, request) }, _constants.CLIENT_SECRET);
}

function handleSuccess(request, meta) {
  return response => new _promise2.default((() => {
    var _ref4 = (0, _asyncToGenerator3.default)(function* (resolve, reject) {
      try {
        const json = yield response.json();

        // Если ответ корректно распарсился
        // Разберем ответ - данная структура обязательна для клиентских ответов

        var _ref5 = json || {};

        const status = _ref5[_constants.RESPONSE_PROPERTY_STATUS],
              result = _ref5[_constants.RESPONSE_PROPERTY_RESULT];

        // Если статус результата - успех, то завершим работу вернув результат

        if (status === _constants.RESPONSE_STATUS_SUCCESS) {
          request.duration();
          request.log.info(`${ PREFIX_LOG }`, meta);
          return resolve(result);
        }

        // Если статус результата - ошибка, то вызовем обработчик ошибок
        return reject(result);
      } catch (e) {
        // Если ошибка парсинга - вызовем обработчик ошибок
        const url = meta.url;

        const error = ParseResponseError(e, { url, request: request.request.id });

        request.duration();
        request.log.error(error.message, (0, _extends3.default)({ error }, meta));
        return reject(result);
      }
    });

    return function (_x3, _x4) {
      return _ref4.apply(this, arguments);
    };
  })());
}

function handleError(request, meta) {
  return e => new _promise2.default((resolve, reject) => {
    const erropt = { url: meta.url, request: request.request.id };
    let error;

    if (e.name === 'FetchError') {
      switch (e.type) {
        // Возникает при таймауте запроса
        case 'request-timeout':
          error = TimeoutError(erropt);break;
        default:
          error = InternalError(new Error(e.message), erropt);
      }
    } else {
      switch (e.code) {
        // Возникает когда нет сервиса к которому обращаемся
        case 'ECONNREFUSED':
          error = ServiceNotAvailableError(e, erropt);
          break;
        default:
          error = InternalError(e, erropt);
      }
    }
    request.duration();
    request.log.error(error.message, meta);
    reject(error);
  });
}
//# sourceMappingURL=fetch.js.map