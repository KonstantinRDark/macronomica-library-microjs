import WrappedError from 'error/wrapped';
import TypedError from 'error/typed';
import jwt from 'jsonwebtoken';
import middleware from 'node-fetch';
import { clear } from './../../../utils/make-request';
import {
  API_TIMEOUT,
  CLIENT_SECRET,
  CLIENT_TRANSPORT_HEADER,
  CLIENT_REQUEST_HEADER,
  CLIENT_PREFIX,
  CLIENT_CONTENT_TYPE,
  RESPONSE_PROPERTY_STATUS,
  RESPONSE_PROPERTY_RESULT,
  RESPONSE_STATUS_SUCCESS
} from './../constants';

const PREFIX_LOG = 'micro.plugins.fetch';

const InternalError = WrappedError({
  message: [
    '{name}: Внутренняя ошибка по запросу [{request}]{url}',
    '{name}: {origMessage}',
  ].join('\n'),
  type   : `${ PREFIX_LOG }.internal`,
  url    : null,
  request: null
});

const ServiceNotAvailableError = WrappedError({
  message: [
    '{name}: Сервис недоступен по запросу [{request}]{url}',
    '{name}: {origMessage}',
  ].join('\n'),
  type   : `${ PREFIX_LOG }.service.not.available`,
  url    : null,
  request: null
});

const ParseResponseError = WrappedError({
  message: [
    '{name}: Ошибка парсинга ответа по запросу [{request}]{url}',
    '{name}: {origMessage}',
  ].join('\n'),
  type   : `${ PREFIX_LOG }.parse.response`,
  url    : null,
  request: null
});

const TimeoutError = TypedError({
  message: '{name}: Превышено время ожидания (timeout={timeout}) запроса [{request}]{url}',
  type   : `${ PREFIX_LOG }.timeout`,
  timeout: API_TIMEOUT,
  code   : 504
});

export default function fetch(app, { name, settings }) {
  let {
    url,
    headers:outerHeaders = {},
    prefix = CLIENT_PREFIX,
    ssh,
    agent
  } = settings;

  if (agent) {
    app.log.trace(`Используется SSH TUNNEL: ${ ssh.username }@${ ssh.host }:${ ssh.port }`);
    app.log.debug('Настройки SSH TUNNEL:', ssh);
    agent.on('error', error => app.log.error(WrappedError({
      message: '{name}: {origMessage}',
      type   : 'micro.plugin.fetch.ssh.internal'
    })(error)));
  }

  return (request, route) => {
    const { api, transport, ...msg } = request;
    const body = clear(msg);
    const meta = {
      api,
      transport,
      request : request.request,
      useAgent: !!agent
    };
    const headers = {
      'Content-Type': CLIENT_CONTENT_TYPE,
      'Referer'     : app.name,
      'User-Agent'  : transport.origin,
      ...outerHeaders,

      [ CLIENT_TRANSPORT_HEADER ]: getSignTransport(transport),
      [ CLIENT_REQUEST_HEADER ]  : getSignRequest(meta.request)
    };
    const options = {
      agent,
      headers,
      method : 'POST',
      timeout: API_TIMEOUT,
      body   : JSON.stringify(body)
    };
    request.duration();
    request.log.trace(`${ PREFIX_LOG }.in`, { body, ...meta });

    let promise;

    try {
      promise = middleware(url + prefix, options);
    } catch (e) {
      return handleError(request, meta)(e);
    }

    return promise.then(
      handleSuccess(request, meta),
      handleError(request, meta)
    );
  };
}

function getSignTransport({ ...transport } = {}) {
  return jwt.sign({ transport: { ...transport } }, CLIENT_SECRET);
}

function getSignRequest({ time, ...request } = {}) {
  return jwt.sign({ request: { ...request } }, CLIENT_SECRET);
}

function handleSuccess(request, meta) {
  return response => new Promise(async (resolve, reject) => {
    try {
      const json = await response.json();

      // Если ответ корректно распарсился
      // Разберем ответ - данная структура обязательна для клиентских ответов
      const {
        [ RESPONSE_PROPERTY_STATUS ]:status,
        [ RESPONSE_PROPERTY_RESULT ]:result
      } = (json || {});

      // Если статус результата - успех, то завершим работу вернув результат
      if (status === RESPONSE_STATUS_SUCCESS) {
        request.duration();
        request.log.trace(`${ PREFIX_LOG }`, meta);
        return resolve(result);
      }

      // Если результат не строка и не Error - сообщим о не поддерживаемой ошибке
      if (typeof result !== 'string' && !(result instanceof Error)) {
        request.log.warn('Возвращается ошибка в не поддерживаемом формате', {
          result,
          typeof   : typeof result,
          transport: request.transport,
          request  : request.request,
        });
      }

      // Если статус результата - ошибка, то вызовем обработчик ошибок
      return reject(typeof result !== 'string' ? result : new Error(result));
    } catch (e) {
      // Если ошибка парсинга - вызовем обработчик ошибок
      const { url } = meta;
      const error = ParseResponseError(e, { url, request: request.request.id });

      request.duration();
      request.log.error(error.message, { error, ...meta });
      return reject(result);
    }
  });
}

function handleError(request, meta) {
  return e => new Promise((resolve, reject) => {
    const erropt = { url: meta.url, request: request.request.id };
    let printError = true;
    let error;

    if (e.name === 'FetchError') {
      switch (e.type) {
        // Возникает при таймауте запроса
        case 'request-timeout': {
          printError = false;
          error = TimeoutError(erropt);
          break;
        }
        default: error = InternalError(new Error(e.message), erropt);
      }
    } else {
      switch (e.code) {
        // Возникает когда нет сервиса к которому обращаемся
        case 'ECONNREFUSED': error = ServiceNotAvailableError(e, erropt);
          break;
        default: error = InternalError(e, erropt);
      }
    }
    request.duration();

    if (printError) {
      request.log.error(error.message, meta);
    }

    reject(error);
  });
}