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

const ERROR_TYPE = 'micro.plugin.fetch';

const InternalError = WrappedError({
  message: [
    '{name}: Внутренняя ошибка по запросу [{request}]{url}',
    '{name}: {origMessage}',
  ].join('\n'),
  type   : `${ ERROR_TYPE }.internal`,
  url    : null,
  request: null
});

const ServiceNotAvailableError = WrappedError({
  message: [
    '{name}: Сервис недоступен по запросу [{request}]{url}',
    '{name}: {origMessage}',
  ].join('\n'),
  type   : `${ ERROR_TYPE }.service.not.available`,
  url    : null,
  request: null
});

const ParseResponseError = WrappedError({
  message: [
    '{name}: Ошибка парсинга ответа по запросу [{request}]{url}',
    '{name}: {origMessage}',
  ].join('\n'),
  type   : `${ ERROR_TYPE }.parse.response`,
  url    : null,
  request: null
});

const TimeoutError = TypedError({
  message: '{name}: Превышено время ожидания (timeout={timeout}) запроса [{request}]{url}',
  type   : `${ ERROR_TYPE }.timeout`,
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
    const meta = {
      api,
      route,
      request : request.request,
      body    : clear(msg),
      url     : url + prefix,
      useAgent: !!agent,
      timeout : API_TIMEOUT
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
      body   : JSON.stringify(meta.body)
    };

    try {
      return middleware(url + prefix, options).then(
        handleSuccess(request, meta),
        handleError(request, meta)
      );
    } catch (e) {
      return handleError(request, meta)(e);
    }
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
        return resolve(result);
      }

      // Если статус результата - ошибка, то вызовем обработчик ошибок
      return reject(result);
    } catch (e) {
      // Если ошибка парсинга - вызовем обработчик ошибок
      const { url } = meta;
      const error = ParseResponseError(e, { url, request: request.request.id });
      request.log.error(error.message, { error, ...meta });
      return reject(result);
    }
  });
}

function handleError(request, meta) {
  return e => new Promise((resolve, reject) => {
    const erropt = { url: meta.url, request: request.request.id };
    let error;

    if (e.name === 'FetchError') {
      switch (e.type) {
        // Возникает при таймауте запроса
        case 'request-timeout': error = TimeoutError(erropt); break;
      }
    }

    switch (e.code) {
      // Возникает когда нет сервиса к которому обращаемся
      case 'ECONNREFUSED': error = ServiceNotAvailableError(e, erropt);
        break;
      default: error = InternalError(e, erropt);
    }

    request.log.error(error.message, meta);
    reject(error);
  });
}