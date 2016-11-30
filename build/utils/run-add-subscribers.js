'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = runAddSubscribers;

var _runSubscribers = require('./run-subscribers');

var _runSubscribers2 = _interopRequireDefault(_runSubscribers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {app} app
 * @returns {Promise<undefined>}
 */
function runAddSubscribers(app) {
  app.log.info('============================ add-actions ===========================');
  return (0, _runSubscribers2.default)(app, app.subscribers.add, subscriber => subscriber(app)).then(result => {
    app.log.info('========================== add-actions-end =========================');
    return result;
  });
}
//# sourceMappingURL=run-add-subscribers.js.map