'use strict';

var _ = require('./../');

var _2 = _interopRequireDefault(_);

var _logWinston = require('./../plugins/log-winston');

var _logWinston2 = _interopRequireDefault(_logWinston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const worker = (0, _2.default)({ id: 'worker', listen: { host: '127.0.0.1', port: 8000 } }).use((0, _logWinston2.default)({ label: 'worker' })).add('cmd:ping', function ping() {
  return 'pong';
});

const client = (0, _2.default)({ id: 'client' }).use((0, _logWinston2.default)({ label: 'client' })).api('worker', { host: '127.0.0.1', port: 8000 });

worker.run().catch(client.log.error).then(() => client.run().then(() => client.act('api:worker, cmd:ping')).then(result => client.log.info('cmd:ping', result)).catch(client.log.error));
//# sourceMappingURL=api.js.map