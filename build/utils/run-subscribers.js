'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = runSubscribers;

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function runSubscribers(microjs, subscribers, getPromise) {
  return new _promise2.default((resolve, reject) => _async2.default.eachSeries(subscribers, iterator, endCb(resolve, reject)));

  function iterator(subscriber, callback) {
    let promise = getPromise(subscriber);

    if (!promise || typeof promise.then !== 'function') {
      promise = _promise2.default.resolve(promise);
    }

    promise.then(() => callback(null)).catch(callback);
  }

  function endCb(resolve, reject) {
    return (err, results) => err ? reject(err) : resolve();
  }
}
//# sourceMappingURL=run-subscribers.js.map