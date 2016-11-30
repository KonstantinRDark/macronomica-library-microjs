'use strict';

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _ = require('./../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HOST = '127.0.0.1';
var PORT = 8000;
var prefix = '/act';

var micro = (0, _2.default)({ host: HOST, port: PORT }).add('cmd:ping', function ping() {
  console.log('pong');
  return 'pong';
});

micro.run().then(function () {

  return (0, _nodeFetch2.default)('http://' + HOST + PORT + prefix, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cmd: 'ping' })
  }).then(function (response) {
    return response.json();
  }).then(function (result) {
    return console.log(result);
  }).catch(function (error) {
    return micro.log.error(error);
  });
}).catch(function (error) {
  return micro.log.error(error);
});
//# sourceMappingURL=all.js.map