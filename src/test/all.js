import fetch from 'node-fetch';
import Micro from './../';

const HOST = '127.0.0.1';
const PORT = 8000;
const prefix = '/act';

const micro = Micro({ host: HOST, port: PORT })
  .add('cmd:ping', function ping() {
    console.log('pong');
    return 'pong';
  });

micro
  .run(() => {

    return fetch(`http://${ HOST }${ PORT }${ prefix }`,
      {
        method,
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ cmd: 'ping' })
      })
      .then(response => response.json())
      .then(result => console.log(result))
      .catch(error => console.error(error));

  })
;
