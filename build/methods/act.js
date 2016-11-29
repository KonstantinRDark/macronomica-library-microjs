'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = act;

var _lodash = require('lodash.isstring');

var _lodash2 = _interopRequireDefault(_lodash);

var _jsonic = require('jsonic');

var _jsonic2 = _interopRequireDefault(_jsonic);

var _defer = require('./../utils/defer');

var _defer2 = _interopRequireDefault(_defer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function act(microjs, manager) {
  return function (pin, cb) {
    var dfd = (0, _defer2.default)(cb);
    var msg = (0, _lodash2.default)(pin) ? (0, _jsonic2.default)(pin) : pin;
    var route = manager.find(msg);

    if (!route) {
      if (msg.cmd !== 'logger') {
        microjs.log.trace('\u0412\u044B\u0437\u043E\u0432 \u043D\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u044E\u0449\u0435\u0433\u043E \u043C\u0430\u0440\u0448\u0440\u0443\u0442\u0430', pin);
      }
      return dfd.reject('\u0412\u044B\u0437\u043E\u0432 \u043D\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u044E\u0449\u0435\u0433\u043E \u043C\u0430\u0440\u0448\u0440\u0443\u0442\u0430');
    }

    try {
      var promise = route.callback(msg, route);

      if (!promise || typeof promise.then !== 'function') {
        promise = Promise.resolve(promise);
      }

      promise.then(dfd.resolve).catch(dfd.reject);

      return dfd.promise;
    } catch (err) {
      microjs.log.error('\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0432\u044B\u0437\u043E\u0432\u0435 \u043C\u0430\u0440\u0448\u0440\u0443\u0442\u0430', pin, err);
      return dfd.reject(err);
    }
  };
}
//# sourceMappingURL=act.js.map