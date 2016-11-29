
export default function runInitSubscribers(microjs, initSubscribers, closeSubscribers) {

  initSubscribers.map(subscriber => subscriber(microjs, { onClose }));

  return Promise.resolve();

  function onClose(cb) {
    closeSubscribers.push(cb);
  }
}