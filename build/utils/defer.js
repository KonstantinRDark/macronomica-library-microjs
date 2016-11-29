'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = defer;
function defer(cb) {
  var hasFunction = cb && typeof cb === 'function';
  var defer = {};

  defer.promise = new Promise(function (resolve, reject) {
    return Object.assign(defer, {
      resolve: handlerResolve(defer, resolve),
      reject: handlerReject(defer, reject)
    });
  });

  return defer;

  function handlerResolve(defer, resolve) {
    return function (result) {
      resolve(result);

      if (hasFunction) {
        cb(null, result);
      }

      return defer.promise;
    };
  }

  function handlerReject(defer, reject) {
    return function (error) {
      reject(error);

      if (hasFunction) {
        cb(error);
      }

      return defer.promise;
    };
  }
};
//# sourceMappingURL=defer.js.map