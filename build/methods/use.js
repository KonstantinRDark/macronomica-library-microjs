'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constants = require('./../constants');

var _runInitSubscribers = require('./../utils/run-init-subscribers');

var _runInitSubscribers2 = _interopRequireDefault(_runInitSubscribers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {app} app
 * @returns {function}
 */
exports.default = app => {
  /**
   * @namespace app.use
   * @param {function} ?cb
   * @returns {app}
   */
  return cb => {
    if (app.state !== _constants.STATE_RUN) {
      app.subscribers.run.push(cb);
    } else {
      (0, _runInitSubscribers2.default)(app, [cb]);
    }

    return app;
  };
};
//# sourceMappingURL=use.js.map