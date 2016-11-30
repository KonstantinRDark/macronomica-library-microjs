'use strict';

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _ = require('./../');

var _2 = _interopRequireDefault(_);

var _logWinston = require('./../plugins/log-winston');

var _logWinston2 = _interopRequireDefault(_logWinston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const HOST = '127.0.0.1';
const PORT = 8000;
const prefix = '/act';

const micro = (0, _2.default)({ listen: { host: HOST, port: PORT } }).use((0, _logWinston2.default)()).add('cmd:ping', function ping() {
  return 'pong';
});

micro.run().then(() => {
  return (0, _nodeFetch2.default)(`http://${ HOST }:${ PORT }${ prefix }`, { method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cmd: 'ping' })
  }).then(response => response.json()).then(result => micro.log.info('cmd:ping', result)).catch(error => micro.log.error('cmd:ping', error));
}).catch(error => micro.log.error(error));
//# sourceMappingURL=all.js.map