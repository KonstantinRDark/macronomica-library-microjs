'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = clientExec;

var _lodash = require('lodash.isstring');

var _lodash2 = _interopRequireDefault(_lodash);

var _jsonic = require('jsonic');

var _jsonic2 = _interopRequireDefault(_jsonic);

var _makeRequestObject = require('./../../utils/make-request-object');

var _makeRequestObject2 = _interopRequireDefault(_makeRequestObject);

var _makeMsg = require('./../../utils/make-msg');

var _makeMsg2 = _interopRequireDefault(_makeMsg);

var _updateDuration = require('./../../utils/update-duration');

var _updateDuration2 = _interopRequireDefault(_updateDuration);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Делаем запрос через транспорт клиента
 * Разбираем запрос
 *
 * @param micro
 * @param client
 * @returns {function(): Promise}
 */
function clientExec(micro, client) {
  return function (pin) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$request = _ref.request,
        request = _ref$request === undefined ? {} : _ref$request;

    return new Promise(function (resolve, reject) {
      micro.queue({
        case: _constants.QUEUE_CASE,
        callback: function callback(next) {
          var msg = (0, _makeMsg2.default)(_extends({}, (0, _lodash2.default)(pin) ? (0, _jsonic2.default)(pin) : pin, {
            request: (0, _makeRequestObject2.default)({ id: request.id, actionId: client.id })
          }));
          return done(micro, client)(msg, function (error, result) {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }

            next(error, result);
          });
        }
      });
    });
  };
}

function done(micro, client) {
  return function (msg, callback) {
    var transport = msg.transport,
        request = msg.request,
        params = msg.params;
    // Параметры для обращения к клиенту через транспорт

    var options = {
      params: params,
      request: request,
      headers: { 'Content-Type': _constants.TRANSPORT_CONTENT_TYPE }
    };

    // Сообщим что запрос начался
    micro.logger.info(_extends({}, request, { action: _constants.ACTION_IN, payload: params }));

    // Отправим запрос клиенту и подпишимся на результаты
    client.transport(options).then(handleSuccess(micro, request, callback), handleError(micro, request, callback));
  };
}

/**
 * Обработчик ответа от клиента в случае успеха
 *
 * @param micro
 * @param request
 * @param callback
 * @returns {function(*=)}
 */
function handleSuccess(micro, request, callback) {
  return function (payload) {
    (0, _updateDuration2.default)(request);
    callback(null, payload);
    micro.logger.info(_extends({}, request, { action: _constants.ACTION_OUT, payload: payload }));
  };
}

/**
 * Обработчик ответа от клиента в случае ошибки
 *
 * @param micro
 * @param request
 * @param callback
 * @returns {function(*=)}
 */
function handleError(micro, request, callback) {
  return function (error) {
    (0, _updateDuration2.default)(request);
    callback(error);
    micro.logger.error(_extends({}, request, { action: _constants.ACTION_ERR, error: error }));
  };
}
//# sourceMappingURL=client-exec.js.map