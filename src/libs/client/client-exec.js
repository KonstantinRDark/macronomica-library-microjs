import isString from 'lodash.isstring';
import jsonic from 'jsonic';
import makeRequestObject from './../../utils/make-request-object';
import makeMsg from './../../utils/make-msg';
import updateDuration from './../../utils/update-duration';
import {TRANSPORT_CONTENT_TYPE, QUEUE_CASE, ACTION_IN, ACTION_OUT, ACTION_ERR} from './constants';

/**
 * Делаем запрос через транспорт клиента
 * Разбираем запрос
 *
 * @param micro
 * @param client
 * @returns {function(): Promise}
 */
export default function clientExec(micro, client) {
  return (pin, { request = {} } = {}) => new Promise((resolve, reject) => {
    micro.queue({
      case    : QUEUE_CASE,
      callback: (next) => {
        const msg = makeMsg({
          ...(isString(pin) ? jsonic(pin) : pin),
          request: makeRequestObject({ id: request.id, actionId: client.id })
        });
        return done(micro, client)(msg, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        
          next(error, result);
        });
      }
    });
  });
}

function done(micro, client) {
  return (msg, callback) => {
    const { transport, request, params } = msg;
    // Параметры для обращения к клиенту через транспорт
    const options = {
      params,
      request,
      headers: { 'Content-Type': TRANSPORT_CONTENT_TYPE }
    };

    // Сообщим что запрос начался
    micro.logger.info({ ...request, action: ACTION_IN, payload: params });

    // Отправим запрос клиенту и подпишимся на результаты
    client.transport(options)
      .then(
        handleSuccess(micro, request, callback),
        handleError(micro, request, callback)
      );
  };
}

/**
 * Обработчик ответа от клиента в случае успеха
 *
 * @param micro
 * @param request
 * @param callback
 * @returns {function(*=)}
 */
function handleSuccess(micro, request, callback) {
  return (payload) => {
    updateDuration(request);
    callback(null, payload);
    micro.logger.info({ ...request, action: ACTION_OUT, payload });
  };
}

/**
 * Обработчик ответа от клиента в случае ошибки
 *
 * @param micro
 * @param request
 * @param callback
 * @returns {function(*=)}
 */
function handleError(micro, request, callback) {
  return error => {
    updateDuration(request);
    callback(error);
    micro.logger.error({ ...request, action: ACTION_ERR, error });
  };
}