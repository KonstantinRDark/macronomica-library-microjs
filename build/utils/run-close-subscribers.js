"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = runCloseSubscribers;
function runCloseSubscribers(microjs, closeSubscribers) {

  closeSubscribers.map(function (subscriber) {
    return subscriber(microjs);
  });

  return Promise.resolve();
}
//# sourceMappingURL=run-close-subscribers.js.map