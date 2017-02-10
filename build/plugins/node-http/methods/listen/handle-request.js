'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = handleRequest;

var _wrapped = require('error/wrapped');

var _wrapped2 = _interopRequireDefault(_wrapped);

var _typed = require('error/typed');

var _typed2 = _interopRequireDefault(_typed);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _buffer = require('buffer');

var _buffer2 = _interopRequireDefault(_buffer);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _getRequest = require('./get-request');

var _getRequest2 = _interopRequireDefault(_getRequest);

var _applyPreprocessors = require('./apply-preprocessors');

var _applyPreprocessors2 = _interopRequireDefault(_applyPreprocessors);

var _constants = require('./../../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PREFIX_LOG = 'micro.plugins.http-node.handle-request';

const InternalError = (0, _wrapped2.default)({
  message: '[{code}:{method}:error] - {origMessage}',
  type: `${ PREFIX_LOG }.internal`,
  code: 500,
  method: null
});

const UrlNotFoundError = (0, _typed2.default)({
  message: '{name} - не поддерживаемый url: {url}',
  type: `${ PREFIX_LOG }.url.not.found`,
  code: 404,
  url: null
});

const CallPrivateMethodError = (0, _typed2.default)({
  message: '{name} - попытка вызова приватного метода: [request]{url}',
  type: `${ PREFIX_LOG }.call.private.method`,
  code: 404,
  url: null,
  request: null
});

const ActError = (0, _wrapped2.default)({
  message: '[{request}] | {code} {method} error | {origMessage}',
  type: `${ PREFIX_LOG }.act`,
  request: null,
  code: null,
  method: null
});

function handleRequest(app, settings) {
  return (req, res, next) => {
    req._originalUrl = req.url;
    req.url = _url2.default.parse(req.url);
    req.query = _qs2.default.parse(req.url.query);

    const pathnameUrl = req.url.pathname;

    if (req.url.pathname !== _constants.SERVER_PREFIX) {
      let error = UrlNotFoundError({ url: pathnameUrl });
      app.log.error(error.message, { error });
      return responseError(res, error);
    }

    (0, _applyPreprocessors2.default)(app, req, res, pathnameUrl).catch(error => responseError(res, error)).then(() => {
      const body = req.body || {};
      const query = req.query || {};
      const pin = (0, _extends3.default)({}, body, query);
      const request = (0, _getRequest2.default)(app, req, pin);

      const meta = {
        /* pin, */
        /* body,
        query, */
        method: req.method,
        request: request.request,
        transport: request.transport
      };

      request.duration();

      if (pin.role === 'plugin' || 'private' in pin && pin.private === true) {
        let error = CallPrivateMethodError({
          request: meta.request.id,
          url: pathnameUrl
        });
        app.log.warn(error.message, meta);
        return responseError(res, error);
      }

      app.log.trace(PREFIX_LOG, meta);

      return request.act(pin).then(success(request, res, meta), error(request, res, meta));
    });
  };
}

function success(request, res, meta) {
  return result => {
    const code = 200;
    let status = _constants.RESPONSE_STATUS_SUCCESS;

    if (result instanceof Error) {
      status = _constants.RESPONSE_STATUS_ERROR;
      result = result.type;
    }

    const outJson = (0, _stringify2.default)({
      [_constants.RESPONSE_PROPERTY_STATUS]: status,
      [_constants.RESPONSE_PROPERTY_RESULT]: result
    });

    res.writeHead(code, {
      'Content-Type': 'application/json',
      // 'Cache-Control' : 'private, max-age=0, no-cache, no-store',
      'Content-Length': _buffer2.default.Buffer.byteLength(outJson)
    });
    request.duration();
    request.log.info(PREFIX_LOG, (0, _extends3.default)({ status }, meta));

    res.end(outJson);
  };
}

function error(request, res, meta) {
  return originalError => {
    let error;

    request.duration();

    switch (originalError.type) {
      case 'micro.act.timeout':
      case 'micro.act.not.found':
        {
          error = ActError(originalError, {
            request: meta.request.id,
            code: originalError.code,
            method: meta.method
          });
          break;
        }
      default:
        {
          error = InternalError(originalError, { method: meta.method });
        }
    }

    if (originalError.type !== 'micro.act.not.found') {
      request.log.error(error.message, (0, _extends3.default)({}, meta, { error }));
    }

    responseError(res, error);
  };
}

function responseError(res, error) {
  const code = error.code || 500;
  const json = (0, _stringify2.default)({
    [_constants.RESPONSE_PROPERTY_STATUS]: _constants.RESPONSE_STATUS_ERROR,
    [_constants.RESPONSE_PROPERTY_RESULT]: error.fullType || error.type
  });

  res.writeHead(code, {
    'Content-Type': 'application/json',
    // 'Cache-Control' : 'private, max-age=0, no-cache, no-store',
    'Content-Length': _buffer2.default.Buffer.byteLength(json)
  });

  res.statusMessage = _http2.default.STATUS_CODES[code];
  res.end(json);
}
//# sourceMappingURL=handle-request.js.map