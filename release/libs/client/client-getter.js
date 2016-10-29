'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = clientGetter;

var _constants = require('./constants');

function clientGetter(micro, name) {
  var client = micro.clients[name];

  if (!client) {
    var msg = {
      actionId: '---------',
      action: _constants.ACTION_ERR,
      error: {
        code: 'error.client.getter/client.not.found',
        message: '\u041A\u043B\u0438\u0435\u043D\u0442 \u0441 \u0438\u043C\u0435\u043D\u0435\u043C "' + name + '" \u043D\u0435 \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0438\u0440\u043E\u0432\u0430\u043D'
      }
    };

    micro.logger.error(msg.error.message, msg);

    return { exec: function exec() {} };
  }

  return client.api;
}
//# sourceMappingURL=client-getter.js.map
