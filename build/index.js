'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Micro = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _patrun = require('patrun');

var _patrun2 = _interopRequireDefault(_patrun);

var _constants = require('./constants');

var _genid = require('./utils/genid');

var _genid2 = _interopRequireDefault(_genid);

var _definePlugins2 = require('./utils/define-plugins');

var _definePlugins3 = _interopRequireDefault(_definePlugins2);

var _dateIsoString = require('./utils/date-iso-string');

var _dateIsoString2 = _interopRequireDefault(_dateIsoString);

var _cliSeparator = require('./utils/cli-separator');

var _cliSeparator2 = _interopRequireDefault(_cliSeparator);

var _queue = require('./utils/queue');

var _queue2 = _interopRequireDefault(_queue);

var _act = require('./libs/act');

var _act2 = _interopRequireDefault(_act);

var _add = require('./libs/add');

var _add2 = _interopRequireDefault(_add);

var _plugin = require('./libs/plugin');

var _plugin2 = _interopRequireDefault(_plugin);

var _client = require('./libs/client');

var _client2 = _interopRequireDefault(_client);

var _listen = require('./libs/listen');

var _listen2 = _interopRequireDefault(_listen);

var _logger = require('./plugins/logger');

var _logger2 = _interopRequireDefault(_logger);

var _http = require('./plugins/transport/http');

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Micro = exports.Micro = function (_Events$EventEmitter) {
  _inherits(Micro, _Events$EventEmitter);

  function Micro() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$plugins = _ref.plugins;

    _ref$plugins = _ref$plugins === undefined ? {} : _ref$plugins;

    var logger = _ref$plugins[_constants.PLUGIN_LOGGER_NAME],
        httpTransport = _ref$plugins[_constants.PLUGIN_TRANSPORT_NAME_HTTP],
        plugins = _objectWithoutProperties(_ref$plugins, [_constants.PLUGIN_LOGGER_NAME, _constants.PLUGIN_TRANSPORT_NAME_HTTP]);

    _classCallCheck(this, Micro);

    var _this = _possibleConstructorReturn(this, (Micro.__proto__ || Object.getPrototypeOf(Micro)).call(this));

    _this.id = (0, _genid2.default)();
    _this.lifecicle = {
      started: false,
      inited: false,
      running: false,
      closed: false
    };
    _this.time = {
      started: undefined
    };
    _this.plugins = {};
    _this.actions = {};
    _this.clients = {};
    _this.__queue = {
      wait: [],
      init: [],
      close: []
    };
    _this.actionManager = undefined;
    _this.genid = _genid2.default;

    _this.__init = function () {
      if (_this.closed()) {
        return;
      }

      if (_this.__queue.wait.length) {
        _this.logger.info([(0, _cliSeparator2.default)(), '# STATUS : ' + _constants.APP_STATE_INSTALLING, (0, _cliSeparator2.default)()].join('\n'));
      }

      _this.lifecicle.inited = true;

      (function loop(micro) {
        var next = function next() {
          return setImmediate(function () {
            return loop(micro);
          });
        };

        if (micro.__queue.wait.length) {
          return micro.__queue.wait = new _queue2.default({ jobs: micro.__queue.wait }).start(next);
        }

        if (!micro.lifecicle.running) {
          micro.logger.info([(0, _cliSeparator2.default)(), '# STATUS : ' + _constants.APP_STATE_RUNNING, (0, _cliSeparator2.default)()].join('\n'));
          micro.emit('ready', micro);
        }

        micro.lifecicle.running = true;

        if (micro.__queue.init.length) {
          return micro.__queue.init = new _queue2.default({ jobs: micro.__queue.init }).start(next);
        }
      })(_this);
    };

    _this.queue = function (job) {
      var cb = void 0;
      var queue = void 0;

      switch (job.case) {
        case 'act':
        case 'client':
          cb = job.callback;
          queue = _this.__queue.init;
          break;
        case 'wait':
        case 'close':
          cb = function cb(done) {
            return job.done.apply(job, _toConsumableArray(job.args)).then(done, _this.die);
          };
          queue = _this.__queue[job.case];
          break;
      }

      if (!_this.lifecicle.inited) {
        !!cb && queue.push(cb);
      } else {
        return !!cb && cb(function () {});
      }

      return _this;
    };

    _this.closed = function () {
      return _this.lifecicle.closed;
    };

    _this.close = function (code) {
      var inst = _this;

      if (inst.lifecicle.closed) {
        return;
      }

      if (!inst.lifecicle.running) {
        return setImmediate(function () {
          return inst.close(code);
        });
      }

      inst.lifecicle.closed = true;

      if (inst.__queue.close.length) {
        inst.logger.info([(0, _cliSeparator2.default)(), '# Status    : ' + _constants.APP_STATE_STOPPED, (0, _cliSeparator2.default)()].join('\n'));
        return new _queue2.default({ jobs: inst.__queue.close }).start(done);
      } else {
        done();
      }

      function done() {
        inst.logger.info([(0, _cliSeparator2.default)(), '# Micro ' + _constants.APP_STATE_STOPPED, (0, _cliSeparator2.default)({ sub: true }), '# Instance  : ' + inst.id, '# When      : ' + (0, _dateIsoString2.default)(Date.now()), '# Code      : ' + code, (0, _cliSeparator2.default)()].join('\n'));

        process.exit(code);
      }
    };

    _this.die = function (error) {
      var micro = _this;

      var stack = error.stack || '';
      stack = stack.replace(/^.*?\n/, '\n').replace(/\n/g, '\n          ');

      micro.logger.error(['##############################################################################################', '# Fatal Error', '# Instance  : ' + micro.id, '# =========================================================================================== ', '  Message   : ' + error.message, '  Code      : ' + error.code, '  Details   : ' + _util2.default.inspect(error.details, { depth: null }), '  When      : ' + new Date().toISOString(), '  Stack     : ' + stack, '  Node      : ' + _util2.default.inspect(process.versions).replace(/\s+/g, ' '), '              ' + _util2.default.inspect(process.features).replace(/\s+/g, ' '), '              ' + _util2.default.inspect(process.moduleLoadList).replace(/\s+/g, ' '), '  Process   : ', '              pid=' + process.pid, '              arch=' + process.arch, '              platform=' + process.platform, '              path=' + process.execPath, '              argv=' + _util2.default.inspect(process.argv).replace(/\n/g, ''), '              env=' + _util2.default.inspect(process.env).replace(/\n/g, ''), '##############################################################################################'].join('\n'));
    };

    _this.act = function (pin, callback) {
      return (0, _act2.default)(_this, pin, callback);
    };

    _this.add = function (pin, callback) {
      return (0, _add2.default)(_this, pin, callback);
    };

    _this.client = function (clientOptions) {
      return (0, _client2.default)(_this, clientOptions);
    };

    _this.listen = function (transportOptions) {
      return (0, _listen2.default)(_this, transportOptions);
    };

    _this.plugin = function (name, plugin) {
      return (0, _plugin2.default)(_this, { name: name, plugin: plugin });
    };

    _this.ready = function (callback) {
      _this.setMaxListeners(_this.getMaxListeners() + 1);
      var emited = false;

      var unbind = _this.once('ready', function () {
        emited = true;
        callback(_this);
        _this.setMaxListeners(Math.max(_this.getMaxListeners() - 1, 0));
      });

      _this.queue({
        case: 'close',
        args: [unbind],
        done: function done(unbind) {
          if (!emited) unbind();
        }
      });

      return unbind;
    };

    var started = _this.time.started = Date.now();
    process.on('exit', _this.close);
    process.on('uncaughtException', _this.die);

    (0, _definePlugins3.default)(_this, _defineProperty({}, _constants.PLUGIN_LOGGER_NAME, logger || (0, _logger2.default)()));

    _this.logger.info([(0, _cliSeparator2.default)(), '# Micro started', (0, _cliSeparator2.default)({ sub: true }), '# Instance  : ' + _this.id, '# When      : ' + (0, _dateIsoString2.default)(started), (0, _cliSeparator2.default)(), '# Status    : ' + _constants.APP_STATE_INITIALIZATION, (0, _cliSeparator2.default)()].join('\n'));

    _this.actionManager = (0, _patrun2.default)({ gex: true });

    if (plugins) {
      (0, _definePlugins3.default)(_this, _extends({}, plugins, _defineProperty({}, _constants.PLUGIN_TRANSPORT_NAME_HTTP, httpTransport || (0, _http2.default)())));
    }

    process.nextTick(_this.__init);
    return _this;
  }

  _createClass(Micro, [{
    key: 'logger',
    get: function get() {
      return this.plugin(_constants.PLUGIN_LOGGER_NAME);
    }
  }, {
    key: 'api',
    get: function get() {
      var micro = this;

      return {
        ready: micro.ready,
        act: micro.act,
        add: micro.add,
        close: micro.close,
        logger: micro.logger,
        plugin: micro.plugin,
        client: micro.client,
        listen: micro.listen
      };
    }
  }]);

  return Micro;
}(_events2.default.EventEmitter);

exports.default = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var micro = new Micro(options);
  return micro.api;
};
//# sourceMappingURL=index.js.map