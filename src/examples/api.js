import Micro from './../';
import WinstonLogPlugin from './../plugins/log-winston';

const worker = Micro({ listen: { host: '127.0.0.1', port: 8000 } })
  .use(WinstonLogPlugin());

const client = Micro()
  .use(WinstonLogPlugin())
  .api('worker', { host: '127.0.0.1', port: 8000 });

worker
  .run()
  .catch(client.log.error)
  .then(() => client
    .run()
    .then(() => client.act('api:worker, cmd:ping'))
    .then(result => client.log.info('cmd:ping', result))
    .catch(client.log.error)
  );