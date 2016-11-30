'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = runCloseSubscribers;

var _runSubscribers = require('./run-subscribers');

var _runSubscribers2 = _interopRequireDefault(_runSubscribers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {app} app
 * @returns {Promise<undefined>}
 */
function runCloseSubscribers(app) {
  app.log.info('========================== app-close-start =========================');
  return (0, _runSubscribers2.default)(app, app.subscribers.end, subscriber => subscriber(app)).then(result => {
    app.log.info('=========================== app-close-end ==========================');
    return result;
  });
}
//# sourceMappingURL=run-close-subscribers.js.map