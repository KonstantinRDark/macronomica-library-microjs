'use strict';

var _ = require('./../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const host = '127.0.0.1';
const port = 8000;
const listen = { host, port };

const worker = (0, _2.default)({ listen });
const client = (0, _2.default)().api('worker', listen);

worker.run().then(worker => client.run()).then(client => client.act({ api: 'worker', cmd: 'ping' })).then(client.log.info).then(() => client.end()).then(() => worker.end()).catch(client.log.error);
//# sourceMappingURL=api.js.map