'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _typed = require('error/typed');

var _typed2 = _interopRequireDefault(_typed);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _httpSshAgent = require('http-ssh-agent');

var _httpSshAgent2 = _interopRequireDefault(_httpSshAgent);

var _lodash = require('lodash.isstring');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isempty');

var _lodash4 = _interopRequireDefault(_lodash3);

var _constants = require('./../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ERROR_TYPE = 'micro.plugin.api-fetch.settings';

const SshSettingsIncorrectError = (0, _typed2.default)({
  message: ['{name}: Не корректные настройки SSH API', 'Пример настроек', { url: 'sshUser@sshHost:sshPort@host:port' }].join(_os2.default.EOL),
  type: `${ ERROR_TYPE }.ssh.incorrect`
});

const SshSettingsUserNotFoundError = (0, _typed2.default)({
  message: '{name}: Отсутвует SSH USER',
  type: `${ ERROR_TYPE }.ssh.incorrect.not.found.user`
});

const SshSettingsPrivateKeyNotFoundError = (0, _typed2.default)({
  message: '{name}: Отсутвует ssh private key in {path}',
  type: `${ ERROR_TYPE }.ssh.incorrect.not.found.private.key`,
  path: null
});

const SshSettingsHostNotFoundError = (0, _typed2.default)({
  message: '{name}: Отсутвует SSH HOST',
  type: `${ ERROR_TYPE }.ssh.incorrect.not.found.host`
});

const SshSettingsPortNotFoundError = (0, _typed2.default)({
  message: '{name}: Отсутвует SSH PORT',
  type: `${ ERROR_TYPE }.ssh.incorrect.not.found.host`
});

const SettingsNotFoundError = (0, _typed2.default)({
  message: '{name}: Отсутвуют настройки для клиента {clientName}',
  type: `${ ERROR_TYPE }.not.found`,
  clientName: null
});

exports.default = (app, name, settings) => {
  if ((0, _lodash2.default)(settings)) {
    settings = { url: settings };
  }

  if ((0, _lodash4.default)(settings)) {
    const error = SettingsNotFoundError({ clientName: name });
    app.log.error(error);
    throw error;
  }

  const protocol = 'http';
  var _settings = settings,
      _settings$url = _settings.url;
  let url = _settings$url === undefined ? '' : _settings$url;
  var _settings$host = _settings.host;
  let host = _settings$host === undefined ? '' : _settings$host;
  var _settings$port = _settings.port;
  let port = _settings$port === undefined ? '' : _settings$port;
  var _settings$ssh = _settings.ssh;
  let ssh = _settings$ssh === undefined ? {} : _settings$ssh;
  var _settings$agent = _settings.agent;
  let agent = _settings$agent === undefined ? null : _settings$agent,
      other = (0, _objectWithoutProperties3.default)(_settings, ['url', 'host', 'port', 'ssh', 'agent']);


  if (!!~url.indexOf('@')) {
    var _url$split = url.split('@'),
        _url$split2 = (0, _slicedToArray3.default)(_url$split, 3);

    let sshUser = _url$split2[0],
        sshUrlOptions = _url$split2[1],
        clientOptions = _url$split2[2];


    if (!clientOptions) {
      clientOptions = sshUrlOptions;
      sshUrlOptions = null;
    }

    var _ref = sshUrlOptions ? sshUrlOptions.split(':') : [],
        _ref2 = (0, _slicedToArray3.default)(_ref, 2),
        _ref2$ = _ref2[0];

    let sshHost = _ref2$ === undefined ? _constants.SSH_HOST : _ref2$;
    var _ref2$2 = _ref2[1];
    let sshPort = _ref2$2 === undefined ? _constants.SSH_PORT : _ref2$2;


    if (!sshUser && !sshHost && !sshPort) {
      throw SshSettingsIncorrectError();
    }

    if (!sshUser || !sshHost || !sshPort) {
      let debugInfo = { sshOptions, sshUrlOptions, clientOptions, sshUser, sshHost, sshPort, settings };
      let error;

      if (!sshUser) {
        error = SshSettingsUserNotFoundError();
      }
      if (!sshHost) {
        error = SshSettingsHostNotFoundError();
      }
      if (!sshPort) {
        error = SshSettingsPortNotFoundError();
      }
      app.log.error(error.message, debugInfo);
      throw error;
    }

    const privateKey = _path2.default.resolve(_constants.SSH_KEY_PATH);

    if (!_fs2.default.existsSync(privateKey)) {
      throw SshSettingsPrivateKeyNotFoundError({ path: privateKey });
    }

    url = clientOptions;
    ssh = (0, _extends3.default)({
      host: sshHost,
      port: sshPort,
      username: sshUser,
      privateKey
    }, ssh);
    agent = (0, _httpSshAgent2.default)(ssh);
  }

  if (!!url && url.length) {
    var _url$split3 = url.split(':');

    var _url$split4 = (0, _slicedToArray3.default)(_url$split3, 2);

    host = _url$split4[0];
    port = _url$split4[1];
  }

  if (port) {
    port = ':' + port;
  }

  return (0, _extends3.default)({ url: `${ protocol }://${ host }${ port }`, ssh, agent }, other);
};
//# sourceMappingURL=parse-settings.js.map