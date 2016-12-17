'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _defer = require('./../utils/defer');

var _defer2 = _interopRequireDefault(_defer);

var _makeRequest = require('./../utils/make-request');

var _makeRequest2 = _interopRequireDefault(_makeRequest);

var _constants = require('./../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    request: request.request
  };

  if (!route) {
    app.log.info(`Вызов не существующего маршрута`, meta);
    return dfd.reject({
      code: 'error.common/act.not.found',
      message: 'Вызов не существующего маршрута'
    });
  }

  const timerId = setTimeout(() => {
    app.log.warn(`error.common/act.timeout`, _extends({}, meta, { action: route.action }));
    dfd.reject(new Error('error.common/act.timeout'));
  }, _constants.ACT_TIMEOUT);

  try {
    let promise = route.callback(request, route);

    if (!promise || typeof promise.then !== 'function') {
      promise = Promise.resolve(promise);
    }

    promise.then(result => {
      clearTimeout(timerId);
      dfd.resolve(result);
    }).catch(error => {
      clearTimeout(timerId);
      dfd.reject(error);
    });

    return dfd.promise;
  } catch (error) {
    app.log.error(`Ошибка при вызове маршрута`, {
      pin, error,
      request: request.request,
      action: route.action
    });
    clearTimeout(timerId);
    return dfd.reject(error);
  }
}
//# sourceMappingURL=act.js.map