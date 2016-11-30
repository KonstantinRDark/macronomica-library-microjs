import fetch from 'node-fetch';
import Micro from './../';
import WinstonLogPlugin from './../plugins/log-winston';

const HOST = '127.0.0.1';
const PORT = 8000;
const prefix = '/act';

const micro = Micro({ listen: { host: HOST, port: PORT } })
  .use(WinstonLogPlugin())
  .add('cmd:ping', function ping() { return 'pong'; });

micro
  .run()
  .then(() => {
    return fetch(`http://${ HOST }:${ PORT }${ prefix }`,
      { method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ cmd: 'ping' })
      })
      .then(response => response.json())
      .then(result => micro.log.info('cmd:ping', result))
      .catch(micro.log.error);
  })
  .catch(micro.log.error)
;
