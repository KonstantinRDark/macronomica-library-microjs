import middleware from 'node-fetch';
import {
  CLIENT_PREFIX,
  CLIENT_CONTENT_TYPE,
  RESPONSE_PROPERTY_STATUS,
  RESPONSE_PROPERTY_RESULT,
  RESPONSE_STATUS_SUCCESS,
  RESPONSE_STATUS_ERROR
} from './../constants';

const ERROR_CODE_PREFIX = 'error.http.client';

export default function fetch(app, { name, settings }) {
  let {
    url,
    headers = {},
    prefix = CLIENT_PREFIX,
    ssh,
    agent
  } = settings;

  if (agent) {
    app.log.trace(`Используется SSH TUNNEL: ${ ssh.username }@${ ssh.host }:${ ssh.port }`);
    app.log.debug('Настройки SSH TUNNEL:', ssh);
    agent
      .on('error', app.log.error)
      .on('verify', (fingerprint, callback) => {
        app.log.info(`Server fingerprint is ${ fingerprint }`);
        callback(); // pass an error to indicate a bad fingerprint
      });
  }

  return (request, route) => new Promise((resolve, reject) => {
    const { api, ...msg } = request;
    const method = 'POST';

    middleware(url + prefix, {
      method,
      agent,
      headers: { 'Content-Type': CLIENT_CONTENT_TYPE, ...headers },
      body   : JSON.stringify(msg)
    })
      .then(
        handleSuccess({ request, resolve, reject }),
        handleError({ request, reject })
      );
  });
}

function handleSuccess({ request, resolve, reject }) {
  return response => {
    const _handleError = handleError({ request, reject });

    response
      .json()
      .then(
        // Если ответ корректно распарсился
        (json = {}) => {
          // Разберем ответ - данная структура обязательна для клиентских ответов
          const {
            [ RESPONSE_PROPERTY_STATUS ]:status,
            [ RESPONSE_PROPERTY_RESULT ]:result
          } = json;

          // Если статус результата - успех, то завершим работу вернув результат
          if (status === RESPONSE_STATUS_SUCCESS) {
            return resolve(result);
          }

          // Если статус результата - ошибка, то вызовем обработчик ошибок
          if (status === RESPONSE_STATUS_ERROR) {
            return _handleError(result);
          }

          // Если что-то непонятное - вызовем обработчик с ошибкой
          return _handleError({
            code   : `${ ERROR_CODE_PREFIX }/unknown.response.structure`,
            message: `Ответ клиента неизвестной структуры`,
            details: json
          });
        },
        // Если ошибка парсинга - вызовем обработчик ошибок
        _handleError
      );
  };
}

function handleError({ request, reject }) {
  return e => {
    let error;

    switch (e.code) {
      // Возникает когда нет сервиса к которому обращаемся
      case 'ECONNREFUSED':
        error = {
          code   : `${ ERROR_CODE_PREFIX }/service.not.available`,
          message: `Клиент по запросу (${ request.id }) недоступен`
        };
        break;
      default: error = {
        code   : e.code || e.status,
        message: e.message || e.statusText,
        details: e.details || undefined
      };
    }

    reject(error);
  };
}