'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _provideCall = require('./../../utils/provide-call');

var _provideCall2 = _interopRequireDefault(_provideCall);

var _makeMsg = require('./../../utils/make-msg');

var _makeMsg2 = _interopRequireDefault(_makeMsg);

var _actProxyClientExec = require('./act-proxy-client-exec');

var _actProxyClientExec2 = _interopRequireDefault(_actProxyClientExec);

var _updateDuration = require('./../../utils/update-duration');

var _updateDuration2 = _interopRequireDefault(_updateDuration);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Добавляет маршрут
function actExec(micro, raw) {
  var _callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

  micro.queue({
    case: _constants.QUEUE_CASE,
    callback: function callback(next) {
      var msg = (0, _makeMsg2.default)(raw);
      var request = msg.request;


      if (!request.actionId) {
        request.actionId = micro.actionManager.find(msg.params);
      }

      done(micro, msg, function (err, result) {
        (0, _provideCall2.default)(micro.api, _callback(err, result));
        next(err);
      });
    }
  });

  return micro;
}exports.default = actExec;
;

function done(micro, msg, callback) {
  var transport = msg.transport,
      request = msg.request,
      params = msg.params;

  var actionId = request.actionId || micro.actionManager.find(params);
  var action = micro.actions[actionId];
  var _handleError = handleError({ micro: micro, request: request, callback: callback });

  micro.logger.info(_extends({}, request, { action: _constants.ACTION_IN, payload: params }));

  if (!action) {
    _handleError({
      code: 'error.act/route.not.found',
      message: '\u041C\u0430\u0440\u0448\u0440\u0443\u0442 ' + JSON.stringify(params) + ' \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D'
    });
    return micro;
  }

  (0, _provideCall2.default)((0, _actProxyClientExec2.default)(micro.api, request), action.callback(params)).then(handleSuccess({ micro: micro, request: request, callback: callback }), _handleError);
}

function handleSuccess(_ref) {
  var micro = _ref.micro,
      request = _ref.request,
      callback = _ref.callback;

  return function (result) {
    (0, _updateDuration2.default)(request);
    (0, _provideCall2.default)(micro.api, callback(null, result));
    micro.logger.info(_extends({}, request, { action: _constants.ACTION_OUT, payload: result }));
  };
}

function handleError(_ref2) {
  var micro = _ref2.micro,
      request = _ref2.request,
      callback = _ref2.callback;

  return function (error) {
    (0, _updateDuration2.default)(request);
    (0, _provideCall2.default)(micro.api, callback(error));
    micro.logger.error(_extends({}, request, { action: _constants.ACTION_ERR, error: error }));
  };
}
//# sourceMappingURL=index.js.map