import runSubscribers from './run-subscribers';

/**
 * @param {app} app
 * @returns {Promise<undefined>}
 */
export default function runAddSubscribers(app) {
  return runSubscribers(app, app.subscribers.add, subscriber => subscriber(app));
}