import path from 'path';
import sshAgent from 'http-ssh-agent';
import isString from 'lodash.isstring';
import error, {
  ERROR_SSH_SETTINGS_INCORRECT
} from './../errors/error';

export default (app, settings) => {
  if (isString(settings)) {
    settings = { url: settings };
  }
  const protocol = 'http';
  let {
    url = '',
    host = '',
    port = '',
    ssh = {},
    agent = null,
    ...other
  } = settings;

  if (!!~url.indexOf('ssh')) {
    let [ sshOptions, sshUrlOptions, clientOptions ] = url.split('@');
    let [ , sshUser ] = sshOptions.split('//') || [];
    let [ sshHost, sshPort ] = sshUrlOptions.split(':') || [];

    if (!sshUser || !sshHost || !sshPort) {
      app.log.error('Не корректные настройки SSH API', settings);
      app.log.error('Пример настроек', {
        url: 'ssh//sshUser@sshHost:sshPort@host:port'
      });
      throw error({ action: 'parse-settings', message: ERROR_SSH_SETTINGS_INCORRECT });
    }

    url = clientOptions;
    agent = sshAgent({
      host      : sshHost,
      port      : sshPort,
      username  : sshUser,
      privateKey: path.resolve(process.env.HOME + '/.ssh/id_rsa'),
      ...ssh
    });
  }

  if (!!url && url.length) {
    [ host, port ] = url.split(':');
  }

  if (port) {
    port = ':' + port;
  }

  return { url: `${ protocol }://${ host }${ port }`, agent, ...other };
};