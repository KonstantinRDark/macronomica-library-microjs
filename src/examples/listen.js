import fetch from 'node-fetch';
import Micro from './../';

const host = '127.0.0.1';
const port = 8000;
const listen = { host, port };
const prefix = '/act';
const micro = Micro({ listen });

micro
  .run()
  .then(() => {
    return fetch(`http://${ host }:${ port }${ prefix }`,
      { method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ cmd: 'ping' })
      })
      .then(response => response.json())
      .then(micro.log.info)
      .then(result => micro.end())
      .catch(micro.log.error);
  })
  .catch(micro.log.error)
;
