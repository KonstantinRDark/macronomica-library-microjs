'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var ERROR_CODE_PREFIX = 'error.http.client';

exports.default = function (micro, plugin, settings) {
  return function (_ref) {
    var params = _ref.params,
        request = _ref.request,
        options = _objectWithoutProperties(_ref, ['params', 'request']);

    return new Promise(function (resolve, reject) {
      var host = settings.host,
          _settings$prefix = settings.prefix,
          prefix = _settings$prefix === undefined ? _constants.CLIENT_PREFIX : _settings$prefix;

      var port = settings.port ? ':' + settings.port : '';
      var url = 'http://' + host + port + prefix;

      (0, _nodeFetch2.default)(url, _extends({}, options, {
        method: 'POST',
        body: JSON.stringify(params)
      })).then(handleSuccess({ request: request, resolve: resolve, reject: reject }), handleError({ request: request, reject: reject }));
    });
  };
};

function handleSuccess(_ref2) {
  var request = _ref2.request,
      resolve = _ref2.resolve,
      reject = _ref2.reject;

  return function (response) {
    var _handleError = handleError({ request: request, reject: reject });

    response.json().then(
    // Если ответ корректно распарсился
    function () {
      var json = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      // Разберем ответ - данная структура обязательна для клиентских ответов
      var status = json[_constants.RESPONSE_PROPERTY_STATUS],
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
        code: ERROR_CODE_PREFIX + '/unknown.response.structure',
        message: '\u041E\u0442\u0432\u0435\u0442 \u043A\u043B\u0438\u0435\u043D\u0442\u0430 \u043D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E\u0439 \u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u044B',
        details: json
      });
    },
    // Если ошибка парсинга - вызовем обработчик ошибок
    _handleError);
  };
}

function handleError(_ref3) {
  var request = _ref3.request,
      reject = _ref3.reject;

  return function (e) {
    var error = void 0;

    switch (e.code) {
      // Возникает когда нет сервиса к которому обращаемся
      case 'ECONNREFUSED':
        error = {
          code: ERROR_CODE_PREFIX + '/service.not.available',
          message: '\u041A\u043B\u0438\u0435\u043D\u0442 \u043F\u043E \u0437\u0430\u043F\u0440\u043E\u0441\u0443 (' + request.id + ') \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D'
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
//# sourceMappingURL=client.js.map