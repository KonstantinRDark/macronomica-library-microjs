import defer from './../utils/defer';
import runCloseSubscribers from './../utils/run-close-subscribers';
import { END_TIMEOUT } from './../constants';

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
    
    let timerId = setTimeout(() => dfd.reject(new Error('error.common/end.timeout')), END_TIMEOUT);
    
    runCloseSubscribers(app)
      .then(() => {
        clearTimeout(timerId);
        dfd.resolve();
      })
      .catch((error) => {
        clearTimeout(timerId);
        dfd.resolve(error);
      });

    return dfd.promise;
  };
}