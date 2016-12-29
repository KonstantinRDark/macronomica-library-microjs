'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _ = require('../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const should = _chai2.default.should();

const host = '127.0.0.1';
const port = 8000;
const WorkerName = 'worker';
const listen = { host, port };

const worker = (0, _2.default)({ name: WorkerName, listen, level: _.LEVEL_OFF }).add({ cmd: 'cmd1' }, request => request.act({ cmd: 'ping' })).add({ cmd: 'cmd2' }, request => request.act({ cmd: 'cmd1' }));
const client = (0, _2.default)({ name: 'client', level: _.LEVEL_OFF }).api(WorkerName, listen);

before(() => _promise2.default.all([worker.run(), client.run()]));
after(() => _promise2.default.all([worker.end(), client.end()]));

describe('api', function () {
  it('#error api setting', () => {
    try {
      return (0, _2.default)({ name: 'client', level: _.LEVEL_OFF }).api('test').run(() => should.equal(null, `micro.plugin.api-fetch.settings.not.found`));
    } catch (error) {
      return error.type.should.equal(`micro.plugin.api-fetch.settings.not.found`);
    }
  });
  it('#exec worker ping', () => worker.act('cmd:ping').then(result => should.equal(result, 'pong')));
  it('#exec client ping', () => client.act('cmd:ping').then(result => should.equal(result, 'pong')));
  it('#exec client api clients', () => client.act({ role: 'plugin', cmd: 'clients' }).then(result => _promise2.default.all([should.exist(result), result.should.be.a('array').with.length(1), result[0].should.be.a('string').equal(WorkerName)])));
  it('#exec client from worker cmd2', () => client.act({ api: 'worker', cmd: 'cmd1' }).then(result => should.equal(result, 'pong')));
});
//# sourceMappingURL=api.spec.js.map