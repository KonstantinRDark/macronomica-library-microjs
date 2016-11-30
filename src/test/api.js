import Micro from './../';
import WinstonLogPlugin from './../plugins/log-winston';

const worker = Micro({ id: 'worker', listen: { host: '127.0.0.1', port: 8000 } })
  .use(WinstonLogPlugin({ label: 'worker' }))
  .add('cmd:ping', function ping() { return 'pong' });

const client = Micro({ id: 'client' })
  .use(WinstonLogPlugin({ label: 'client' }))
  .api('worker', { host: '127.0.0.1', port: 8000 });

worker
  .run()
  .then(() => client.run())
  .then(() => client.act('api:worker, cmd:ping'))
  .then(result => client.log.info('cmd:ping', result))
  .catch(error => client.log.error('cmd:ping', error));