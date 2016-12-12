import runSubscribers from './run-subscribers';

/**
 * @param {app} app
 * @returns {Promise<undefined>}
 */
export default function runAddSubscribers(app) {
  app.log.trace('============================ add-actions ===========================');
  return runSubscribers(app, app.subscribers.add, subscriber => subscriber(app))
    .then(result => {
      app.log.trace('========================== add-actions-end =========================');
      return result;
    });
}