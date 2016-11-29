
export default function defer(cb) {
  const hasFunction = cb && typeof cb === 'function';
  const defer = {};

  defer.promise = new Promise((resolve, reject) => Object.assign(defer, {
    resolve: handlerResolve(defer, resolve),
    reject : handlerReject(defer, reject),
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