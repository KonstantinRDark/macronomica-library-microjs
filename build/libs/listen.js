'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constants = require('./client/constants');

// Запускает прослушку транспорта
exports.default = function (micro, transportOptions) {
  var type = transportOptions.type;

  var pluginTransport = micro.plugin(type);

  if (!pluginTransport) {
    var error = new Error(['\u0422\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442 "' + type + '" \u043D\u0435 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442\u0441\u044F', '\u041F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u043C\u044B\u0435 \u0442\u0438\u043F\u044B \u0442\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442\u043E\u0432: [ "' + _constants.TRANSPORT_SUPPORTS.join('", "') + '" ]'].join('. '));
    error.code = 'error.listen/type.not.available';
    error.details = { options: transportOptions };
    return micro.die(error);
  }

  pluginTransport.listen(transportOptions);

  return micro.api;
};
//# sourceMappingURL=listen.js.map