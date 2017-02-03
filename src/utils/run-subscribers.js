import WrappedError from 'error/wrapped';
import Queue3 from 'queue3';

const InternalError = WrappedError({
  message: '{name} - {origMessage}',
  type   : 'micro.utils.run-subscribers.internal'
});

export default function runSubscribers(microjs, subscribers, getPromise) {
  return new Promise((resolve, reject) => {
    let q = new Queue3({ concurrency: 1 });

    subscribers.forEach(subscriber => q.push(
      callback => {
        let promise = getPromise(subscriber);

        if (!promise || typeof promise.then !== 'function') {
          promise = Promise.resolve(promise);
        }

        promise.then(() => callback(), callback);
      },
      (error) => {
        if (error) {
          reject(InternalError(error));
        } else if (!q.jobs.length){
          resolve();
        }
      }
    ));
  });
}