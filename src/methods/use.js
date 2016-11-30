import { STATE_RUN } from './../constants';
import runInitSubscribers from './../utils/run-init-subscribers';

/**
 * @param {app} app
 * @returns {function}
 */
export default app => {
  /**
   * @namespace app.use
   * @param {function} ?cb
   * @returns {app}
   */
  return cb => {
    if (app.state !== STATE_RUN) {
      app.subscribers.run.push(cb);
    } else {
      runInitSubscribers(app, [ cb ]);
    }

    return app;
  };
};