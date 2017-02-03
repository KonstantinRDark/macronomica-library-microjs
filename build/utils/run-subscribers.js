'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = runSubscribers;

var _wrapped = require('error/wrapped');

var _wrapped2 = _interopRequireDefault(_wrapped);

var _queue = require('queue3');

var _queue2 = _interopRequireDefault(_queue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const InternalError = (0, _wrapped2.default)({
  message: '{name} - {origMessage}',
  type: 'micro.utils.run-subscribers.internal'
});

function runSubscribers(microjs, subscribers, getPromise) {
  return new _promise2.default((resolve, reject) => {
    let q = new _queue2.default({ concurrency: 1 });

    subscribers.forEach(subscriber => q.push(callback => {
      let promise = getPromise(subscriber);

      if (!promise || typeof promise.then !== 'function') {
        promise = _promise2.default.resolve(promise);
      }

      promise.then(() => callback(), callback);
    }, error => {
      console.log('exec', error, q.jobs.length);

      if (error) {
        reject(InternalError(error));
      } else if (!q.jobs.length) {
        resolve();
      }
    }));
  });
}
//# sourceMappingURL=run-subscribers.js.map