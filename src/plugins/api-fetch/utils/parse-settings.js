import path from 'path';
import sshAgent from 'http-ssh-agent';
import isString from 'lodash.isstring';
import { SSH_HOST, SSH_PORT, SSH_KEY_PATH } from './../constants';
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

  if (!!~url.indexOf('@')) {
    let [ sshUser, sshUrlOptions, clientOptions ] = url.split('@');

    if (!clientOptions) {
      clientOptions = sshUrlOptions;
      sshUrlOptions = null;
    }

    let [ sshHost = SSH_HOST, sshPort = SSH_PORT ] = sshUrlOptions? sshUrlOptions.split(':') : [];

    if (!sshUser && !sshHost && !sshPort) {
      app.log.error('Не корректные настройки SSH API', settings);
      app.log.error('Пример настроек', { url: 'sshUser@sshHost:sshPort@host:port' });
      throw error({ action: 'parse-settings', message: ERROR_SSH_SETTINGS_INCORRECT });
    }

    if (!sshUser || !sshHost || !sshPort) {
      let debugInfo = { sshOptions, sshUrlOptions, clientOptions, sshUser, sshHost, sshPort, settings };
      if (!sshUser) { app.log.error('Отсутвует SSH USER', debugInfo) }
      if (!sshHost) { app.log.error('Отсутвует SSH HOST', debugInfo) }
      if (!sshPort) { app.log.error('Отсутвует SSH PORT', debugInfo) }
      throw error({ action: 'parse-settings', message: ERROR_SSH_SETTINGS_INCORRECT });
    }

    url = clientOptions;
    ssh = {
      host      : sshHost,
      port      : sshPort,
      username  : sshUser,
      privateKey: path.resolve(SSH_KEY_PATH),
      ...ssh
    };
    agent = sshAgent(ssh);
  }

  if (!!url && url.length) {
    [ host, port ] = url.split(':');
  }

  if (port) {
    port = ':' + port;
  }

  return { url: `${ protocol }://${ host }${ port }`, ssh, agent, ...other };
};