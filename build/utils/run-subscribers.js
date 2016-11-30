'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = runSubscribers;

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function runSubscribers(microjs, subscribers, getPromise) {
  return new Promise((resolve, reject) => _async2.default.eachSeries(subscribers, iterator, endCb(resolve, reject)));

  function iterator(subscriber, callback) {
    let promise = getPromise(subscriber);

    if (!promise || typeof promise.then !== 'function') {
      promise = Promise.resolve(promise);
    }

    promise.then(() => callback(null)).catch(callback);
  }

  function endCb(resolve, reject) {
    return (err, results) => err ? reject(err) : resolve();
  }
}
//# sourceMappingURL=run-subscribers.js.map