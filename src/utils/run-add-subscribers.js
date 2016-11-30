import runSubscribers from './run-subscribers';

/**
 * @param {app} app
 * @returns {Promise<undefined>}
 */
export default function runAddSubscribers(app) {
  app.log.info('============================ add-actions ===========================');
  return runSubscribers(app, app.subscribers.add, subscriber => subscriber(app))
    .then(result => {
      app.log.info('========================== add-actions-end =========================');
      return result;
    });
}