import runSubscribers from './run-subscribers';

/**
 * @param {app} app
 * @returns {Promise<undefined>}
 */
export default function runCloseSubscribers(app) {
  return runSubscribers(app, app.subscribers.end, subscriber => subscriber(app));
}