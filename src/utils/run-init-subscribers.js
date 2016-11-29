import Queue from 'queue3';
import defer from './defer';

export default function runInitSubscribers(microjs, initSubscribers, closeSubscribers) {
  const queue = new Queue();
  let count = 0;
  // TODO дописать алгоритм последовательного запуска
  initSubscribers.map(subscriber => queue.push(cb => {
    count++;
    let p = subscriber(microjs, { onClose });

    if (!p || typeof p.then !== 'function') {
      p = Promise.resolve(p);
    }

     p.then(() => cb(null))
      .catch(cb);
  }));

  return dfd.promise;

  function onClose(cb) {
    closeSubscribers.push(cb);
  }
}