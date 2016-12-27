'use strict';

var _ = require('./../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const host = '127.0.0.1';
const port = 8000;
const listen = { host, port };

const worker = (0, _2.default)({ name: 'worker', listen, level: _.LEVEL_INFO }).add({ cmd: 'cmd1' }, request => request.act({ cmd: 'ping' })).add({ cmd: 'cmd2' }, request => request.act({ cmd: 'cmd1' }));
const client = (0, _2.default)({ name: 'client', level: _.LEVEL_INFO }).api('worker', listen);

worker.run().then(worker => client.run()).then(() => client.act({ api: 'worker', cmd: 'cmd1' })).then(client.log.info).then(() => client.act({ api: 'worker', cmd: 'level', level: _.LEVEL_WARN })).then(client.log.info).then(() => client.end()).then(() => worker.end()).catch(client.log.error);
//# sourceMappingURL=api.js.map