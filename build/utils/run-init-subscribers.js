"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = runInitSubscribers;
function runInitSubscribers(microjs, initSubscribers, closeSubscribers) {

  initSubscribers.map(function (subscriber) {
    return subscriber(microjs, { onClose: onClose });
  });

  return Promise.resolve();

  function onClose(cb) {
    closeSubscribers.push(cb);
  }
}
//# sourceMappingURL=run-init-subscribers.js.map