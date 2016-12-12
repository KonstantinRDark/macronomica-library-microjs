import runSubscribers from './run-subscribers';

/**
 * @param {app} app
 * @returns {Promise<undefined>}
 */
export default function runCloseSubscribers(app) {
  app.log.trace('========================== app-close-start =========================');
  return runSubscribers(app, app.subscribers.end, subscriber => subscriber(app))
    .then(result => {
      app.log.trace('=========================== app-close-end ==========================');
      return result;
    });
}