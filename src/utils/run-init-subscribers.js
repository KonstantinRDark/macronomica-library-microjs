import runSubscribers from './run-subscribers';

/**
 * @param {app} app
 * @param {Array<function>} [subscribers]
 * @returns {Promise<undefined>}
 */
export default function runInitSubscribers(app, subscribers = app.subscribers.run) {
  return runSubscribers(app, subscribers, subscriber => subscriber(app, { onClose }));

  function onClose(cb, method = 'push') {
    app.subscribers.end[ method ](cb);
  }
}