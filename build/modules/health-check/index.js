'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = HealthCheckModule;
function HealthCheckModule() {
  let settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return (app, _ref) => {
    let onClose = _ref.onClose;

    const pingPin = 'cmd:ping';
    app.add(pingPin, function ping() {
      return 'pong';
    });
    onClose(() => app.del(pingPin));
  };
}
//# sourceMappingURL=index.js.map