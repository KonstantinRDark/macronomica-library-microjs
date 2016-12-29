'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getClientConfig;

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _process$env = process.env,
    _process$env$CONFIG_C = _process$env.CONFIG_CLIENTS_SECTION;
const CONFIG_CLIENTS_SECTION = _process$env$CONFIG_C === undefined ? 'clients' : _process$env$CONFIG_C;
var _process$env$CONFIG_S = _process$env.CONFIG_SSH_PRIVATE_KEY;
const CONFIG_SSH_PRIVATE_KEY = _process$env$CONFIG_S === undefined ? 'client.sshPrivateKey' : _process$env$CONFIG_S;
var _process$env$SSH_PRIV = _process$env.SSH_PRIVATE_KEY;
const SSH_PRIVATE_KEY = _process$env$SSH_PRIV === undefined ? _config2.default.has(CONFIG_SSH_PRIVATE_KEY) ? _config2.default.get(CONFIG_SSH_PRIVATE_KEY) : '/.ssh/id_rsa' : _process$env$SSH_PRIV;
function getClientConfig(app, name) {
  if (!_config2.default.has(`${ CONFIG_CLIENTS_SECTION }.${ name }`)) {
    return {};
  }

  let cfg = { url: _config2.default.get(`${ CONFIG_CLIENTS_SECTION }.${ name }`) };

  if (!!~cfg.url.indexOf('@')) {
    cfg.ssh = {
      privateKey: _path2.default.resolve(_path2.default.join(process.env.HOME, SSH_PRIVATE_KEY))
    };
  }

  return cfg;
}
//# sourceMappingURL=get-client-config.js.map