import defer from './../utils/defer';
import runCloseSubscribers from './../utils/run-close-subscribers';

/**
 * @param {object} microjs                // Экземпляр библиотеки
 * @param {function[]} endSubscribers     // Список подписчиков на этап закрытия
 * @returns {function(?function):Promise}
 */
export default function run(microjs, { subscribers: { end: endSubscribers } }) {
  let dfd;

  return cb => {
    if (dfd) {
      return dfd.promise;
    }

    dfd = defer(cb);

    runCloseSubscribers(microjs, endSubscribers)
      .then(dfd.resolve)
      .catch(dfd.reject);

    return dfd.promise;
  };
}