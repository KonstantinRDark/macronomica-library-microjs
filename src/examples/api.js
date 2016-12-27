import Micro, { LEVEL_INFO, LEVEL_WARN } from './../';

const host = '127.0.0.1';
const port = 8000;
const listen = { host, port };

const worker = Micro({ name: 'worker', listen, level: LEVEL_INFO })
  .add({ cmd: 'cmd1' }, request => request.act({ cmd: 'ping' }))
  .add({ cmd: 'cmd2' }, request => request.act({ cmd: 'cmd1' }))
  ;
const client = Micro({ name: 'client', level: LEVEL_INFO }).api('worker', listen);

worker
  .run()
  .then(worker => client.run())
  .then(() => client.act({ api: 'worker', cmd: 'cmd1' }))
  .then(client.log.info)
  .then(() => client.act({ api: 'worker', cmd: 'level', level: LEVEL_WARN }))
  .then(client.log.info)
  .then(() => client.end())
  .then(() => worker.end())
  .catch(client.log.error);