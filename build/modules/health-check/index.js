'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = HealthCheckModule;

var _setLevel = require('./actions/set-level');

var _setLevel2 = _interopRequireDefault(_setLevel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function HealthCheckModule() {
  let settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return (app, _ref) => {
    let onClose = _ref.onClose;

    app.add({ cmd: 'ping' }, function ping() {
      return 'pong';
    });
    app.add({ cmd: 'level' }, _setLevel2.default);
  };
}
//# sourceMappingURL=index.js.map