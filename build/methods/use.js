"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * @param {app} app
 * @returns {function}
 */
exports.default = function (app) {
  /**
   * @namespace app.use
   * @param {function} ?cb
   * @returns {app}
   */
  return function (cb) {
    app.subscribers.run.push(cb);
    return app;
  };
};
//# sourceMappingURL=use.js.map