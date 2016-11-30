import async from 'async';

export default function runSubscribers(microjs, subscribers, getPromise) {
  return new Promise((resolve, reject) =>
    async.eachSeries(subscribers, iterator, endCb(resolve, reject)));

  function iterator(subscriber, callback) {
    let promise = getPromise(subscriber);

    if (!promise || typeof promise.then !== 'function') {
      promise = Promise.resolve(promise);
    }

    promise.then(() => callback(null))
      .catch(callback);
  }

  function endCb(resolve, reject) {
    return (err, results) => err ? reject(err) : resolve();
  }
}