import isString from 'lodash.isstring';
import jsonic from 'jsonic';
import genid from './../utils/genid';

// Добавляет маршрут
export default (micro, pin, callback) => {
  const action = {
    id  : genid(),
    pin : isString(pin) ? jsonic(pin) : pin,
    name: callback.name || '',
    callback
  };

  micro.logger.info(`Добавление нового маршрута`, { id: action.id, payload: pin });

  micro.actions[ action.id ] = action;

  micro.actionManager.add(action.pin, action.id);

  return micro;
};