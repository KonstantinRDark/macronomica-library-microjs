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
  return (0, _runSubscribers2.default)(app, app.subscribers.run, subscriber => subscriber(app, { onClose }));

  function onClose(cb) {
    let method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'push';

    app.subscribers.end[method](cb);
  }
}
//# sourceMappingURL=run-init-subscribers.js.map