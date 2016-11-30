'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defer = require('./../utils/defer');

var _defer2 = _interopRequireDefault(_defer);

var _runCloseSubscribers = require('./../utils/run-close-subscribers');

var _runCloseSubscribers2 = _interopRequireDefault(_runCloseSubscribers);

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

    (0, _runCloseSubscribers2.default)(app).then(dfd.resolve).catch(dfd.reject);

    return dfd.promise;
  };
};
//# sourceMappingURL=end.js.map