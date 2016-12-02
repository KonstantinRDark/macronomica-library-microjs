'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ = require('./../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const client = (0, _2.default)({ level: _.LEVEL_ALL }).api('auths', {
  url: 'ssh//root@auths.data.backend.macronomica.com:8000',
  ssh: {
    privateKey: _path2.default.resolve(process.env.HOME + '/.ssh/ssh-tunel-test/id_rsa')
  }
});

client.run().then(client => client.act({
  api: 'auths',
  cmd: 'verify',
  criteria: { login: 'kniaz@example.com', password: 'kniaz' }
})).then(client.log.info).then(() => client.end()).catch(client.log.error);
//# sourceMappingURL=api-ssh.js.map