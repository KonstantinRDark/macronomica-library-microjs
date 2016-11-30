'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = runInitSubscribers;

var _runSubscribers = require('./run-subscribers');

var _runSubscribers2 = _interopRequireDefault(_runSubscribers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {app} app
 * @returns {Promise<undefined>}
 */
function runInitSubscribers(app) {
  return (0, _runSubscribers2.default)(app, app.subscribers.run, function (subscriber) {
    return subscriber(app, { onClose: onClose });
  });

  function onClose(cb) {
    app.subscribers.end.push(cb);
  }
}
//# sourceMappingURL=run-init-subscribers.js.map