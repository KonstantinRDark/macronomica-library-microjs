'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defer = require('./../utils/defer');

var _defer2 = _interopRequireDefault(_defer);

var _runCloseSubscribers = require('./../utils/run-close-subscribers');

var _runCloseSubscribers2 = _interopRequireDefault(_runCloseSubscribers);

var _constants = require('./../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {app} app
 * @returns {function:Promise}
 */
exports.default = app => {
  let dfd;
  /**
   * @namespace app.end
   * @param {function} [cb]
   * @returns {Promise<app>}
   */
  return cb => {
    if (dfd) {
      return dfd.promise;
    }

    dfd = (0, _defer2.default)(cb);

    let timerId = setTimeout(() => dfd.reject(new Error('error.common/end.timeout')), _constants.END_TIMEOUT);

    (0, _runCloseSubscribers2.default)(app).then(() => {
      clearTimeout(timerId);
      dfd.resolve();
    }).catch(error => {
      clearTimeout(timerId);
      dfd.resolve(error);
    });

    return dfd.promise;
  };
};
//# sourceMappingURL=end.js.map