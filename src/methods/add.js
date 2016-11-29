import isString from 'lodash.isstring';
import jsonic from 'jsonic';
import genid from './../utils/genid';

export default function add(microjs, { manager }) {
  return (pin, cb) => {
    const action = {
      id  : genid(),
      name: cb.name || ''
    };

    microjs.log.info(`Добавление нового маршрута`, action);

    manager.add(isString(pin) ? jsonic(pin) : pin, { pin, action, callback: cb });

    return microjs;
  };
}