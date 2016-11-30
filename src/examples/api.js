import Micro from './../';

const host = '127.0.0.1';
const port = 8000;
const listen = { host, port };

const worker = Micro({ listen });
const client = Micro().api('worker', listen);

worker
  .run()
  .then(worker => client.run())
  .then(client => client.act({ api: 'worker', cmd: 'ping' }))
  .then(client.log.info)
  .then(() => client.end())
  .then(() => worker.end())
  .catch(client.log.error);