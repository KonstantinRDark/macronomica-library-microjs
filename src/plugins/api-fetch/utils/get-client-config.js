import config from 'config';
import path from 'path';
const {
  CONFIG_CLIENTS_SECTION = 'clients',
  CONFIG_SSH_PRIVATE_KEY = 'client.sshPrivateKey',
  SSH_PRIVATE_KEY = config.has(CONFIG_SSH_PRIVATE_KEY)
    ? config.get(CONFIG_SSH_PRIVATE_KEY)
    : '/.ssh/id_rsa'
} = process.env;

export default function getClientConfig(app, name) {
  if (!config.has(`${ CONFIG_CLIENTS_SECTION }.${ name }`)) {
    return {};
  }

  let cfg = { url: config.get(`${ CONFIG_CLIENTS_SECTION }.${ name }`) };

  if (!!~cfg.url.indexOf('@')) {
    cfg.ssh = {
      privateKey: path.resolve(path.join(process.env.HOME, SSH_PRIVATE_KEY))
    };
  }

  return cfg;
}