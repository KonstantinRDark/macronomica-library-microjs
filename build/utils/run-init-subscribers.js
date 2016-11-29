'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = runInitSubscribers;

var _queue = require('queue3');

var _queue2 = _interopRequireDefault(_queue);

var _defer = require('./defer');

var _defer2 = _interopRequireDefault(_defer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function runInitSubscribers(microjs, initSubscribers, closeSubscribers) {
  var queue = new _queue2.default();
  var count = 0;
  // TODO дописать алгоритм последовательного запуска
  initSubscribers.map(function (subscriber) {
    return queue.push(function (cb) {
      count++;
      var p = subscriber(microjs, { onClose: onClose });

      if (!p || typeof p.then !== 'function') {
        p = Promise.resolve(p);
      }

      p.then(function () {
        return cb(null);
      }).catch(cb);
    });
  });

  return dfd.promise;

  function onClose(cb) {
    closeSubscribers.push(cb);
  }
}
//# sourceMappingURL=run-init-subscribers.js.map