import fetch from 'node-fetch';
import Micro, { LEVEL_INFO } from './../';
import WinstonLogPlugin from './../plugins/log-winston';

const HOST = '127.0.0.1';
const PORT = 8000;
const prefix = '/act';

const micro = Micro({ level: LEVEL_INFO, listen: { host: HOST, port: PORT } })
  .use(WinstonLogPlugin());

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
      .then(result => micro.end())
      .catch(micro.log.error);
  })
  .catch(micro.log.error)
;
