'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = defer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function defer(cb) {
  const hasFunction = cb && typeof cb === 'function';
  const defer = {};

  defer.promise = new _promise2.default((resolve, reject) => (0, _assign2.default)(defer, {
    resolve: handlerResolve(defer, resolve),
    reject: handlerReject(defer, reject)
  }));

  return defer;

  function handlerResolve(defer, resolve) {
    return result => {
      resolve(result);

      if (hasFunction) {
        cb(null, result);
      }

      return defer.promise;
    };
  }

  function handlerReject(defer, reject) {
    return error => {
      reject(error);

      if (hasFunction) {
        cb(error);
      }

      return defer.promise;
    };
  }
};
//# sourceMappingURL=defer.js.map