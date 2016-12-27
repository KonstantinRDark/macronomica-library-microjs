'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _ = require('./../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const host = '127.0.0.1';
const port = 8000;
const listen = { host, port };
const prefix = '/act';
const micro = (0, _2.default)({ listen });

micro.run().then(() => {
  return (0, _nodeFetch2.default)(`http://${ host }:${ port }${ prefix }`, { method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: (0, _stringify2.default)({ cmd: 'ping' })
  }).then(response => response.json()).then(micro.log.info).then(result => micro.end()).catch(micro.log.error);
}).catch(micro.log.error);
//# sourceMappingURL=listen.js.map