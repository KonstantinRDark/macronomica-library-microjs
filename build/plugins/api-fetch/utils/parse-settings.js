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

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _httpSshAgent = require('http-ssh-agent');

var _httpSshAgent2 = _interopRequireDefault(_httpSshAgent);

var _lodash = require('lodash.isstring');

var _lodash2 = _interopRequireDefault(_lodash);

var _constants = require('./../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ERROR_TYPE = 'micro.plugin.fetch.ssh.options.incorrect';

const SshSettingsIncorrectError = (0, _typed2.default)({
  message: ['{name}: Не корректные настройки SSH API', 'Пример настроек', { url: 'sshUser@sshHost:sshPort@host:port' }].join(_os2.default.EOL),
  type: `${ ERROR_TYPE }`
});

const SshSettingsUserNotFoundError = (0, _typed2.default)({
  message: '{name}: Отсутвует SSH USER',
  type: `${ ERROR_TYPE }.not.found.user`
});

const SshSettingsHostNotFoundError = (0, _typed2.default)({
  message: '{name}: Отсутвует SSH HOST',
  type: `${ ERROR_TYPE }.not.found.host`
});

const SshSettingsPortNotFoundError = (0, _typed2.default)({
  message: '{name}: Отсутвует SSH PORT',
  type: `${ ERROR_TYPE }.not.found.host`
});

exports.default = (app, settings) => {
  if ((0, _lodash2.default)(settings)) {
    settings = { url: settings };
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

    url = clientOptions;
    ssh = (0, _extends3.default)({
      host: sshHost,
      port: sshPort,
      username: sshUser,
      privateKey: _path2.default.resolve(_constants.SSH_KEY_PATH)
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