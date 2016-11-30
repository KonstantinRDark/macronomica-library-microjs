"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
    app.subscribers.run.push(cb);
    return app;
  };
};
//# sourceMappingURL=use.js.map