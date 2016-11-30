'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash.isstring');

var _lodash2 = _interopRequireDefault(_lodash);

var _jsonic = require('jsonic');

var _jsonic2 = _interopRequireDefault(_jsonic);

var _genid = require('./../utils/genid');

var _genid2 = _interopRequireDefault(_genid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Добавляет маршрут
exports.default = function (micro, pin, callback) {
  var action = {
    id: (0, _genid2.default)(),
    pin: (0, _lodash2.default)(pin) ? (0, _jsonic2.default)(pin) : pin,
    name: callback.name || '',
    callback: callback
  };

  micro.logger.info('\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043D\u043E\u0432\u043E\u0433\u043E \u043C\u0430\u0440\u0448\u0440\u0443\u0442\u0430', { id: action.id, payload: pin });

  micro.actions[action.id] = action;

  micro.actionManager.add(action.pin, action.id);

  return micro;
};
//# sourceMappingURL=add.js.map