import defer from './../utils/defer';
import runCloseSubscribers from './../utils/run-close-subscribers';

/**
 * @param {app} app
 * @returns {function:Promise}
 */
export default app => {
  let dfd;
  /**
   * @namespace app.end
   * @param {function} [cb]
   * @returns {Promise<app>}
   */
  return cb => {
    if (dfd) {
      return dfd.promise;
    }

    dfd = defer(cb);

    runCloseSubscribers(app)
      .then(dfd.resolve)
      .catch(dfd.reject);

    return dfd.promise;
  };
}