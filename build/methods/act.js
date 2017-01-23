'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _typed = require('error/typed');

var _typed2 = _interopRequireDefault(_typed);

var _wrapped = require('error/wrapped');

var _wrapped2 = _interopRequireDefault(_wrapped);

var _lodash = require('lodash.isnumber');

var _lodash2 = _interopRequireDefault(_lodash);

var _defer = require('./../utils/defer');

var _defer2 = _interopRequireDefault(_defer);

var _makeRequest = require('./../utils/make-request');

var _makeRequest2 = _interopRequireDefault(_makeRequest);

var _constants = require('./../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ERROR_TYPE = 'micro.act';

const ActInternalError = (0, _wrapped2.default)({
  message: '{name}: {origMessage}',
  type: `${ ERROR_TYPE }.internal`
});

const ActNotFoundError = (0, _typed2.default)({
  message: '{name}: Вызов не существующего маршрута',
  type: `${ ERROR_TYPE }.not.found`,
  code: 404
});

const TimeoutError = (0, _typed2.default)({
  message: '{name}: Превышено время выполнения (timeout={timeout}) запроса',
  type: `${ ERROR_TYPE }.timeout`,
  timeout: null,
  code: 408
});

/**
 * @param {app} app
 * @returns {function:app}
 */

exports.default = app => {
  /**
   * @namespace app.act
   * @param {string|object} pin
   * @param {function} [cb]
   * @returns {app}
   */
  return (pin, cb) => {
    if (app.state === _constants.STATE_RUN) {
      return exec(app, pin, cb);
    }

    let dfd = (0, _defer2.default)(() => exec(app, pin, cb));

    app.on('running', () => setTimeout(dfd.resolve, 10));

    return dfd.promise;
  };
};

function exec(app, pin, cb) {
  const dfd = (0, _defer2.default)(cb);
  const request = (0, _makeRequest2.default)(app, pin);
  const route = app.manager.find((0, _makeRequest.clear)(request));
  const meta = {
    pin: (0, _makeRequest.clear)(request),
    action: !!route ? route.action : undefined,
    request: request.request,
    transport: request.transport
  };

  if (!route) {
    const error = ActNotFoundError();
    app.log.warn(error.message, meta);
    return dfd.reject(error);
  }
  const timeout = (0, _lodash2.default)(+request.timeout) && !isNaN(+request.timeout) ? +request.timeout : _constants.ACT_TIMEOUT;
  let timerId;

  if (+timeout !== -1) {
    timerId = setTimeout(() => {
      const wrapped = TimeoutError({ timeout });
      app.log.warn(wrapped, (0, _extends3.default)({}, meta, { action: route.action }));
      dfd.reject(wrapped);
    }, timeout);
  }

  app.log.trace(`[${ meta.request.id }] Маршрут (action=${ route.action.name || route.action.id })`, meta);

  try {
    let promise = route.callback(request, route);

    if (!promise || typeof promise.then !== 'function') {
      promise = _promise2.default.resolve(promise);
    }

    promise.then(result => {
      if (timerId) {
        clearTimeout(timerId);
      }
      dfd.resolve(result);
    }).catch(error => {
      if (timerId) {
        clearTimeout(timerId);
      }
      dfd.reject(error);
    });
  } catch (error) {
    const wrapped = ActInternalError(error);
    if (timerId) {
      clearTimeout(timerId);
    }

    app.log.error(wrapped, meta);
    dfd.reject(wrapped);
  }

  return dfd.promise;
}
//# sourceMappingURL=act.js.map