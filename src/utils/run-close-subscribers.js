
export default function runCloseSubscribers(microjs, closeSubscribers) {

  closeSubscribers.map(subscriber => subscriber(microjs));

  return Promise.resolve();
}