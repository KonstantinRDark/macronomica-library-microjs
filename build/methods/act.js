'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash.isstring');

var _lodash2 = _interopRequireDefault(_lodash);

var _jsonic = require('jsonic');

var _jsonic2 = _interopRequireDefault(_jsonic);

var _defer = require('./../utils/defer');

var _defer2 = _interopRequireDefault(_defer);

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
      return exec();
    }
    let dfd = (0, _defer2.default)(exec);

    app.on('running', () => setTimeout(dfd.resolve, 10));

    return dfd.promise;

    function exec() {
      const dfd = (0, _defer2.default)(cb);
      const msg = (0, _lodash2.default)(pin) ? (0, _jsonic2.default)(pin) : pin;
      const route = app.manager.find(msg);

      if (!route) {
        app.log.trace(`Вызов не существующего маршрута`, pin);
        return dfd.reject(`Вызов не существующего маршрута`);
      }

      try {
        let promise = route.callback(msg, route);

        if (!promise || typeof promise.then !== 'function') {
          promise = Promise.resolve(promise);
        }

        promise.then(dfd.resolve).catch(dfd.reject);

        return dfd.promise;
      } catch (err) {
        app.log.error(`Ошибка при вызове маршрута`, pin, err);
        return dfd.reject(err);
      }
    }
  };
};
//# sourceMappingURL=act.js.map