import path from 'path';
import Micro, { LEVEL_ALL } from './../';
const ssh = {
  privateKey: path.resolve(process.env.HOME + '/.ssh/ssh-tunel-test/id_rsa')
};

const client = Micro({ level: LEVEL_ALL })
  .api('media', { url: 'root@media.data.backend.macronomica.com:8000', ssh })
  .api('users', { url: 'root@users.data.backend.macronomica.com:8000', ssh })
  ;

client
  .run()
  .then(client => Promise.all([
    client.act({ api: 'media', cmd: 'ping' }).then(client.log.info),
    client.act({ api: 'users', cmd: 'ping' }).then(client.log.info),
  ]))
  .catch(client.log.error)
  .then(() => client.end())
;