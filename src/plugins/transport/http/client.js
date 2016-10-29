import fetch from 'node-fetch';
import {
  CLIENT_PREFIX,
  RESPONSE_PROPERTY_STATUS,
  RESPONSE_PROPERTY_RESULT,
  RESPONSE_STATUS_SUCCESS,
  RESPONSE_STATUS_ERROR
} from './constants';

const ERROR_CODE_PREFIX = 'error.http.client';

export default (micro, plugin, settings) => {
  return ({ params, request, ...options }) => new Promise((resolve, reject) => {
    const { host, prefix = CLIENT_PREFIX } = settings;
    const port = settings.port ? `:${ settings.port }` : '';
    const url = `http://${ host }${ port }${ prefix }`;
  
    fetch(url, {
      ...options,
      method: 'POST',
      body  : JSON.stringify(params)
    })
      .then(
        handleSuccess({ request, resolve, reject }),
        handleError({ request, reject })
      );
  });
};

function handleSuccess({ request, resolve, reject }) {
  return response => {
    const _handleError = handleError({ request, reject });
    
    // Если ответ не успешен - вызовем обраточик ошибок
    if (!response.ok) {
      return _handleError({
        code   : response.status,
        message: response.statusText
      });
    }
  
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