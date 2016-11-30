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
  return (0, _runSubscribers2.default)(app, app.subscribers.add, subscriber => subscriber(app));
}
//# sourceMappingURL=run-add-subscribers.js.map