'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ = require('./../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ssh = {
  privateKey: _path2.default.resolve(process.env.HOME + '/.ssh/ssh-tunel-test/id_rsa')
};

const client = (0, _2.default)({ level: _.LEVEL_ALL }).api('geo', { url: 'root@geo.data.backend.macronomica.com:8000', ssh }).api('media', { url: 'root@media.data.backend.macronomica.com:8000', ssh }).api('users', { url: 'root@users.data.backend.macronomica.com:8000', ssh });

client.run().then(() => client.act({ api: 'geo', cmd: 'ping' }).then(result => client.log.info(`api:geo - result`))).then(() => client.act({ api: 'media', cmd: 'ping' }).then(result => client.log.info(`api:media - result`))).then(() => client.act({ api: 'users', cmd: 'ping' }).then(result => client.log.info(`api:users - result`))).catch(client.log.error).then(() => client.end());
//# sourceMappingURL=api-ssh.js.map