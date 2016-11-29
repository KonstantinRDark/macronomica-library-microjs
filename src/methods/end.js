import defer from './../utils/defer';
import runCloseSubscribers from './../utils/run-close-subscribers';

/**
 * @param {object} microjs                // Экземпляр библиотеки
 * @param {function[]} closeSubscribers   // Список подписчиков на этап закрытия
 * @returns {function(?function):Promise}
 */
export default function run(microjs, closeSubscribers) {
  let dfd;

  return cb => {
    if (dfd) {
      return dfd.promise;
    }

    dfd = defer(cb);

    runCloseSubscribers(microjs, closeSubscribers)
      .then(dfd.resolve)
      .catch(dfd.reject);

    return dfd.promise;
  };
}