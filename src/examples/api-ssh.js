import path from 'path';
import Micro, { LEVEL_ALL } from './../';
const ssh = {
  privateKey: path.resolve(process.env.HOME + '/.ssh/ssh-tunel-test/id_rsa')
};

const client = Micro({ level: LEVEL_ALL })
  .api('geo', { url: 'root@geo.data.backend.macronomica.com:8000', ssh })
  .api('media', { url: 'root@media.data.backend.macronomica.com:8000', ssh })
  .api('users', { url: 'root@users.data.backend.macronomica.com:8000', ssh })
  ;

client
  .run()
  .then(() => client.act({ api: 'geo', cmd: 'ping' }).then(result => client.log.info(`api:geo - result`)))
  .then(() => client.act({ api: 'media', cmd: 'ping' }).then(result => client.log.info(`api:media - result`)))
  .then(() => client.act({ api: 'users', cmd: 'ping' }).then(result => client.log.info(`api:users - result`)))
  .catch(client.log.error)
  .then(() => client.end())
;