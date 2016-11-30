'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash.isstring');

var _lodash2 = _interopRequireDefault(_lodash);

var _clientGetter = require('./client-getter');

var _clientGetter2 = _interopRequireDefault(_clientGetter);

var _clientSetter = require('./client-setter');

var _clientSetter2 = _interopRequireDefault(_clientSetter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Регистрирует клиента
exports.default = function (micro, clientOptions) {
  if ((0, _lodash2.default)(clientOptions)) {
    return (0, _clientGetter2.default)(micro, clientOptions);
  }

  var errors = ['name', 'type', 'host'];
  var host = clientOptions.host;


  if (host === '0.0.0.0') {
    host = '127.0.0.1';
  }

  if (['127.0.0.1', 'localhost'].includes(host)) {
    errors.push('port');
  }

  errors.some(function (property) {
    if (!clientOptions[property]) {
      var error = new TypeError('\u041F\u0440\u0438 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0438 \u043A\u043B\u0438\u0435\u043D\u0442\u0430 \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u043E "' + property + '" \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E');
      error.code = 'error.client.property.' + property + '.is.required';
      error.details = { options: clientOptions };
      micro.die(error);
      return true;
    }

    return false;
  });

  return (0, _clientSetter2.default)(micro, clientOptions);
};
//# sourceMappingURL=index.js.map