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

const PREFIX_LOG = 'micro.plugins.http-node.handle-request';

const InternalError = WrappedError({
  message: '[{code}:{method}:error] - {origMessage}',
  type   : `${ PREFIX_LOG }.internal`,
  code   : 500,
  method : null
});

const UrlNotFoundError = TypedError({
  message: '{name} - не поддерживаемый url: {url}',
  type   : `${ PREFIX_LOG }.url.not.found`,
  code   : 404,
  url    : null
});

const CallPrivateMethodError = TypedError({
  message: '{name} - попытка вызова приватного метода: [request]{url}',
  type   : `${ PREFIX_LOG }.call.private.method`,
  code   : 404,
  url    : null,
  request: null
});

const ActError = WrappedError({
  message: '[{request}] | {code} {method} error | {origMessage}',
  type   : `${ PREFIX_LOG }.act`,
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
        const body = (req.body || {});
        const query = (req.query || {});
        const pin = {
          ...body,
          ...query
        };
        const request = getRequest(app, req, pin);

        const meta = {
          /* pin, */
          /* body,
          query, */
          method   : req.method,
          request  : request.request,
          transport: request.transport
        };

        request.duration();

        if (pin.role === 'plugin' || ('private' in pin && pin.private === true)) {
          let error = CallPrivateMethodError({
            request: meta.request.id,
            url    : pathnameUrl
          });
          app.log.warn(error.message, meta);
          return responseError(res, error);
        }

        app.log.trace(PREFIX_LOG, meta);

        return request.act(pin).then(
          success(request, res, meta),
          error(request, res, meta)
        );
      });
  };
}

function success(request, res, meta) {
  return result => {
    const code = 200;
    let status = RESPONSE_STATUS_SUCCESS;

    if (result instanceof Error) {
      status = RESPONSE_STATUS_ERROR;
      result = result.type;
    }

    const outJson = JSON.stringify({
      [ RESPONSE_PROPERTY_STATUS ]: status,
      [ RESPONSE_PROPERTY_RESULT ]: result
    });

    res.writeHead(code, {
      'Content-Type'  : 'application/json',
      // 'Cache-Control' : 'private, max-age=0, no-cache, no-store',
      'Content-Length': buffer.Buffer.byteLength(outJson)
    });
    request.duration();
    request.log.trace(PREFIX_LOG, { status, /*result,*/ ...meta });

    res.end(outJson);
  };
}

function error(request, res, meta) {
  return (originalError) => {
    let error;

    request.duration();

    switch (originalError.type) {
      case 'micro.act.timeout':
      case 'micro.act.not.found': {
        error = ActError(originalError, {
          request: meta.request.id,
          code   : originalError.code,
          method : meta.method
        });
        break;
      }
      default: {
        error = InternalError(originalError, { method: meta.method });
      }
    }

    if (originalError.type !== 'micro.act.not.found') {
      request.log.error(error.message, { ...meta, error });
    }

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