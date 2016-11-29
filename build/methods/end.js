'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = run;

var _defer = require('./../utils/defer');

var _defer2 = _interopRequireDefault(_defer);

var _runCloseSubscribers = require('./../utils/run-close-subscribers');

var _runCloseSubscribers2 = _interopRequireDefault(_runCloseSubscribers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {object} microjs                // Экземпляр библиотеки
 * @param {function[]} closeSubscribers   // Список подписчиков на этап закрытия
 * @returns {function(?function):Promise}
 */
function run(microjs, closeSubscribers) {
  var dfd = void 0;

  return function (cb) {
    if (dfd) {
      return dfd.promise;
    }

    dfd = (0, _defer2.default)(cb);

    (0, _runCloseSubscribers2.default)(microjs, closeSubscribers).then(dfd.resolve).catch(dfd.reject);

    return dfd.promise;
  };
}
//# sourceMappingURL=end.js.map