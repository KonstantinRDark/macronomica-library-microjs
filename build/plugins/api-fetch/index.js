'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ApiFetchPlugin;

var _httpSshAgent = require('http-ssh-agent');

var _httpSshAgent2 = _interopRequireDefault(_httpSshAgent);

var _fetch = require('./methods/fetch');

var _fetch2 = _interopRequireDefault(_fetch);

var _parseSettings = require('./utils/parse-settings');

var _parseSettings2 = _interopRequireDefault(_parseSettings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ApiFetchPlugin(app) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  let name = _ref.name,
      settings = _ref.settings;

  settings = (0, _parseSettings2.default)(app, settings);

  return (app, _ref2) => {
    let onClose = _ref2.onClose;

    const apiPin = `api:${ name }`;

    app.add(apiPin, (0, _fetch2.default)(app, { name, settings }));

    onClose(() => app.del(apiPin));

    return Promise.resolve();
  };
}
//# sourceMappingURL=index.js.map