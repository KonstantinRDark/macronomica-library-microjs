import TypedError from 'error/typed';
import os from 'os';
import path from 'path';
import sshAgent from 'http-ssh-agent';
import isString from 'lodash.isstring';
import { SSH_HOST, SSH_PORT, SSH_KEY_PATH } from './../constants';

const ERROR_TYPE = 'micro.plugin.fetch.ssh.options.incorrect';

const SshSettingsIncorrectError = TypedError({
  message: [
    '{name}: Не корректные настройки SSH API',
    'Пример настроек', { url: 'sshUser@sshHost:sshPort@host:port' },
  ].join(os.EOL),
  type: `${ ERROR_TYPE }`
});

const SshSettingsUserNotFoundError = TypedError({
  message: '{name}: Отсутвует SSH USER',
  type   : `${ ERROR_TYPE }.not.found.user`
});

const SshSettingsHostNotFoundError = TypedError({
  message: '{name}: Отсутвует SSH HOST',
  type   : `${ ERROR_TYPE }.not.found.host`
});

const SshSettingsPortNotFoundError = TypedError({
  message: '{name}: Отсутвует SSH PORT',
  type   : `${ ERROR_TYPE }.not.found.host`
});


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
      throw SshSettingsIncorrectError();
    }

    if (!sshUser || !sshHost || !sshPort) {
      let debugInfo = { sshOptions, sshUrlOptions, clientOptions, sshUser, sshHost, sshPort, settings };
      let error;

      if (!sshUser) { error = SshSettingsUserNotFoundError() }
      if (!sshHost) { error = SshSettingsHostNotFoundError() }
      if (!sshPort) { error = SshSettingsPortNotFoundError() }
      app.log.error(error.message, debugInfo);
      throw error;
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