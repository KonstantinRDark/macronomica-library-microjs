import WrappedError from 'error/wrapped';
import TypedError from 'error/typed';

import http from 'http';
import buffer from 'buffer';
import qs from 'qs';
import url from 'url';
import getRequest from './get-request';
import applyPreprocessors from './apply-preprocessors';

import {
  SERVER_PREFIX,
  RESPONSE_PROPERTY_STATUS,
  RESPONSE_PROPERTY_RESULT,
  RESPONSE_STATUS_SUCCESS,
  RESPONSE_STATUS_ERROR
} from './../../constants';

const ERROR_TYPE = 'micro.plugin.http-node';

const InternalError = WrappedError({
  message: '[{code}:{method}:error] - {origMessage}',
  type   : `${ ERROR_TYPE }.internal`,
  code   : 500,
  method : null
});

const UrlNotFoundError = TypedError({
  message: '{name} - не поддерживаемый url: {url}',
  type   : `${ ERROR_TYPE }.url.not.found`,
  code   : 404,
  url    : null
});

const CallPrivateMethodError = TypedError({
  message: '{name} - попытка вызова приватного метода: [request]{url}',
  type   : `${ ERROR_TYPE }.call.private.method`,
  code   : 404,
  url    : null,
  request: null
});

const ActError = WrappedError({
  message: '[{request}] | {code} {method} error | {origMessage}',
  type   : `${ ERROR_TYPE }.act`,
  request: null,
  code   : null,
  method : null
});

export default function handleRequest(app, settings){
  return (req, res, next) => {
    req._originalUrl = req.url;
    req.url = url.parse(req.url);
    req.query = qs.parse(req.url.query);

    const pathnameUrl = req.url.pathname;

    if (req.url.pathname !== SERVER_PREFIX) {
      let error = UrlNotFoundError({ url: pathnameUrl });
      app.log.error(error.message, { error });
      return responseError(res, error);
    }

    applyPreprocessors(app, req, res, pathnameUrl)
      .catch(error => responseError(res, error))
      .then(() => {
        const pin = {
          ...(req.body || {}),
          ...req.query
        };
        const request = getRequest(app, req, pin);

        const meta = { pin, request: request.request };
        const errmeta = {
          request: request.request.id,
          url    : pathnameUrl
        };

        if (pin.role === 'plugin') {
          let error = CallPrivateMethodError(errmeta);
          app.log.warn(error.message, meta);
          return responseError(res, error);
        }

        return app.act({ ...request, ...pin })
          .then(
            success(request, pin, req, res),
            error(request, pin, req, res)
          );
      });
  };
}

function success(request, pin, req, res) {
  return result => {
    const level = 'info';
    const code = 200;
    let status = RESPONSE_STATUS_SUCCESS;

    if (result instanceof Error) {
      status = RESPONSE_STATUS_ERROR;
      result = result.type;
    }

    const meta = { request: request.request, pin };

    const outJson = JSON.stringify({
      [ RESPONSE_PROPERTY_STATUS ]: status,
      [ RESPONSE_PROPERTY_RESULT ]: result
    });

    res.writeHead(code, {
      'Content-Type'  : 'application/json',
      // 'Cache-Control' : 'private, max-age=0, no-cache, no-store',
      'Content-Length': buffer.Buffer.byteLength(outJson)
    });

    const message = [
      `[${ request.request.id }]`,
      `${ code } ${ req.method } ${ status }`,
      `${ request.duration() }ms`
    ].join(' | ');

    request.log[ level ](message, meta);

    res.end(outJson);
  };
}

function error(request, pin, req, res) {
  return (originalError) => {
    let error;

    request.duration();

    switch (originalError.type) {
      case 'micro.act.timeout':
      case 'micro.act.not.found': {
        error = ActError(originalError, {
          request: request.request.id,
          code   : originalError.code,
          method : req.method
        });
        break;
      }
      default: {
        error = InternalError(originalError, { method: req.method });
      }
    }

    const meta = {
      request: request.request,
      error,
      pin
    };

    request.log.error(error.message, { ...meta, error });

    responseError(res, error);
  };
}

function responseError(res, error) {
  const code = error.code || 500;
  const json = JSON.stringify({
    [ RESPONSE_PROPERTY_STATUS ]: RESPONSE_STATUS_ERROR,
    [ RESPONSE_PROPERTY_RESULT ]: error.fullType || error.type
  });

  res.writeHead(code, {
    'Content-Type'  : 'application/json',
    // 'Cache-Control' : 'private, max-age=0, no-cache, no-store',
    'Content-Length': buffer.Buffer.byteLength(json)
  });

  res.statusMessage = http.STATUS_CODES[ code ];
  res.end(json);
}