'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = clientSetter;

var _clientExec = require('./client-exec');

var _clientExec2 = _interopRequireDefault(_clientExec);

var _genid = require('./../../utils/genid');

var _genid2 = _interopRequireDefault(_genid);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 1) Регистрируем клиента
 * 2) Создаем транспорт для общения с клиентом
 * 2) Создаем транспорт для общения с клиентом
 */
function clientSetter(micro, transportOptions) {
  var name = transportOptions.name,
      type = transportOptions.type;

  var pluginTransport = micro.plugin(type);

  if (!pluginTransport) {
    var error = new Error(['\u0422\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442 \u043A\u043B\u0438\u0435\u043D\u0442\u0430 "' + type + '" \u043D\u0435 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442\u0441\u044F', '\u041F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u043C\u044B\u0435 \u0442\u0438\u043F\u044B \u0442\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442\u043E\u0432: [ "' + _constants.TRANSPORT_SUPPORTS.join('", "') + '" ]'].join('. '));
    error.code = 'error.client.setter/type.not.available';
    error.details = { options: transportOptions };
    return micro.die(error);
  }

  var clientId = (0, _genid2.default)();
  var transport = pluginTransport.client(transportOptions);
  var client = {
    id: clientId,
    name: name,
    transport: transport
  };
  var api = {
    exec: (0, _clientExec2.default)(micro, client)
  };

  micro.clients[name] = _extends({}, client, { api: api });

  micro.logger.info('\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F \u043A\u043B\u0438\u0435\u043D\u0442\u0430 "' + name + '"', { id: clientId, payload: { transportOptions: transportOptions } });

  return micro;
}
//# sourceMappingURL=client-setter.js.map
