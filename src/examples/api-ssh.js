import path from 'path';
import Micro, { LEVEL_ALL } from './../';

const client = Micro({ level: LEVEL_ALL }).api('auths', {
  url: 'root@auths.data.backend.macronomica.com:8000',
  ssh: {
    privateKey: path.resolve(process.env.HOME + '/.ssh/ssh-tunel-test/id_rsa')
  }
});

client
  .run()
  .then(client => client.act({
    api     : 'auths',
    cmd     : 'verify',
    criteria: { login: 'kniaz@example.com', password: 'kniaz' }
  }))
  .then(client.log.info)
  .then(() => client.end())
  .catch(client.log.error);