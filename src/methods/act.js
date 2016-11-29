import isString from 'lodash.isstring';
import jsonic from 'jsonic';
import defer from './../utils/defer';

export default function act(microjs, { manager, promises }) {
  return (pin, cb) => {
    const dfd = defer(cb);
    const msg = isString(pin) ? jsonic(pin) : pin;
    const route = manager.find(msg);

    if (!route) {
      if (msg.cmd !== 'logger') {
        microjs.log.trace(`Вызов не существующего маршрута`, pin);
      }
      return dfd.reject(`Вызов не существующего маршрута`);
    }

    try {
      let promise = route.callback(msg, route);

      if (!promise || typeof promise.then !== 'function') {
        promise = Promise.resolve(promise);
      }

      promise.then(dfd.resolve).catch(dfd.reject);

      return dfd.promise;
    } catch (err) {
      microjs.log.error(`Ошибка при вызове маршрута`, pin, err);
      return dfd.reject(err);
    }
  };
}