import chai from 'chai';
import Micro, { LEVEL_OFF } from '../';

const should = chai.should();

const host = '127.0.0.1';
const port = 8000;
const WorkerName = 'worker';
const listen = { host, port };

const worker = Micro({ name: WorkerName, listen/*, level: LEVEL_OFF*/ })
    .add({ cmd: 'cmd1' }, request => request.act({ cmd: 'ping' }))
    .add({ cmd: 'cmd2' }, request => request.act({ cmd: 'cmd1' }))
  ;
const client = Micro({ name: 'client'/*, level: LEVEL_OFF */})
  .api(WorkerName, listen);

before(() => Promise.all([ worker.run(), client.run() ]));
after(() => Promise.all([ worker.end(), client.end() ]));

describe('api', function() {
  it('#error api setting', () => {
    try {
      return Micro({ name: 'client', level: LEVEL_OFF })
        .api('test')
        .run(() => should.equal(null, `micro.plugin.api-fetch.settings.not.found`));
    } catch (error) {
      return error.type.should.equal(`micro.plugin.api-fetch.settings.not.found`);
    }
  });
  it('#exec worker ping', () => worker.act('cmd:ping').then(result => should.equal(result, 'pong')));
  it('#exec client ping', () => client.act('cmd:ping').then(result => should.equal(result, 'pong')));
  it('#exec client api clients', () => client
    .act({ role: 'plugin', cmd: 'clients' })
    .then(result => Promise.all([
      should.exist(result),
      result.should.be.a('array').with.length(1),
      result[ 0 ].should.be.a('string').equal(WorkerName),
    ]))
  );
  it('#exec client from worker cmd2', () => client
    .act({ api: 'worker', cmd: 'cmd2' })
    .then(result => should.equal(result, 'pong'))
  );

});