'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _httpSshAgent = require('http-ssh-agent');

var _httpSshAgent2 = _interopRequireDefault(_httpSshAgent);

var _lodash = require('lodash.isstring');

var _lodash2 = _interopRequireDefault(_lodash);

var _constants = require('./../constants');

var _error = require('./../errors/error');

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

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
      other = _objectWithoutProperties(_settings, ['url', 'host', 'port', 'ssh', 'agent']);

  if (!!~url.indexOf('@')) {
    var _url$split = url.split('@'),
        _url$split2 = _slicedToArray(_url$split, 3);

    let sshUser = _url$split2[0],
        sshUrlOptions = _url$split2[1],
        clientOptions = _url$split2[2];


    if (!clientOptions) {
      clientOptions = sshUrlOptions;
      sshUrlOptions = null;
    }

    var _ref = sshUrlOptions ? sshUrlOptions.split(':') : [],
        _ref2 = _slicedToArray(_ref, 2),
        _ref2$ = _ref2[0];

    let sshHost = _ref2$ === undefined ? _constants.SSH_HOST : _ref2$;
    var _ref2$2 = _ref2[1];
    let sshPort = _ref2$2 === undefined ? _constants.SSH_PORT : _ref2$2;


    if (!sshUser && !sshHost && !sshPort) {
      app.log.error('Не корректные настройки SSH API', settings);
      app.log.error('Пример настроек', { url: 'sshUser@sshHost:sshPort@host:port' });
      throw (0, _error2.default)({ action: 'parse-settings', message: _error.ERROR_SSH_SETTINGS_INCORRECT });
    }

    if (!sshUser || !sshHost || !sshPort) {
      let debugInfo = { sshOptions, sshUrlOptions, clientOptions, sshUser, sshHost, sshPort, settings };
      if (!sshUser) {
        app.log.error('Отсутвует SSH USER', debugInfo);
      }
      if (!sshHost) {
        app.log.error('Отсутвует SSH HOST', debugInfo);
      }
      if (!sshPort) {
        app.log.error('Отсутвует SSH PORT', debugInfo);
      }
      throw (0, _error2.default)({ action: 'parse-settings', message: _error.ERROR_SSH_SETTINGS_INCORRECT });
    }

    url = clientOptions;
    ssh = _extends({
      host: sshHost,
      port: sshPort,
      username: sshUser,
      privateKey: _path2.default.resolve(_constants.SSH_KEY_PATH)
    }, ssh);
    agent = (0, _httpSshAgent2.default)(ssh);
  }

  if (!!url && url.length) {
    var _url$split3 = url.split(':');

    var _url$split4 = _slicedToArray(_url$split3, 2);

    host = _url$split4[0];
    port = _url$split4[1];
  }

  if (port) {
    port = ':' + port;
  }

  return _extends({ url: `${ protocol }://${ host }${ port }`, ssh, agent }, other);
};
//# sourceMappingURL=parse-settings.js.map