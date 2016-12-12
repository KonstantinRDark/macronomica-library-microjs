'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _patrun = require('patrun');

var _patrun2 = _interopRequireDefault(_patrun);

var _genid = require('./utils/genid');

var _genid2 = _interopRequireDefault(_genid);

var _dateIsoString = require('./utils/date-iso-string');

var _dateIsoString2 = _interopRequireDefault(_dateIsoString);

var _logWinston = require('./plugins/log-winston');

var _logWinston2 = _interopRequireDefault(_logWinston);

var _nodeHttp = require('./plugins/node-http');

var _nodeHttp2 = _interopRequireDefault(_nodeHttp);

var _healthCheck = require('./modules/health-check');

var _healthCheck2 = _interopRequireDefault(_healthCheck);

var _log = require('./methods/log');

var _log2 = _interopRequireDefault(_log);

var _use = require('./methods/use');

var _use2 = _interopRequireDefault(_use);

var _add = require('./methods/add');

var _add2 = _interopRequireDefault(_add);

var _del = require('./methods/del');

var _del2 = _interopRequireDefault(_del);

var _act = require('./methods/act');

var _act2 = _interopRequireDefault(_act);

var _api = require('./methods/api');

var _api2 = _interopRequireDefault(_api);

var _end = require('./methods/end');

var _end2 = _interopRequireDefault(_end);

var _run = require('./methods/run');

var _run2 = _interopRequireDefault(_run);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @namespace app
 * @class Microjs
 * @augments EventEmitter
 */
class Microjs extends _events2.default {

  /**
   * @this app
   * @param settings
   */


  /**
   * Список подписчиков
   * @namespace app.subscribers
   * @type {{ run: Array<function>, add: Array<function>, end: Array<function> }}
   */


  /**
   * Плагин логгера по умолчанию
   * @namespace app.defaultLogPlugin
   * @type {function}
   */


  /**
   * @namespace app.manager
   * @type {object}
   */

  /**
   * @namespace app.id
   * @type {string}
   */
  constructor() {
    let settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    super();
    this.id = (0, _genid2.default)();
    this.name = process.env.APP_NAME || 'microjs';
    this.state = _constants.STATE_START;
    this.manager = (0, _patrun2.default)({ gex: true });
    this.defaultTransportPlugin = _nodeHttp2.default;
    this.defaultLogPlugin = _logWinston2.default;
    this.modules = [(0, _healthCheck2.default)()];
    this.subscribers = {
      run: [], // подписчики для этапа запуска работы
      add: [], // подписчики для этапа регистрации действий
      end: [] // подписчики для этапа завершения работы
    };
    this.time = {
      started: Date.now(),
      running: null
    };
    this.log = (0, _log2.default)(this);
    this.use = (0, _use2.default)(this);
    this.add = (0, _add2.default)(this);
    this.del = (0, _del2.default)(this);
    this.api = (0, _api2.default)(this);
    this.act = (0, _act2.default)(this);
    this.end = (0, _end2.default)(this);
    this.run = (0, _run2.default)(this);
    initialize(this, settings);
    this.on('running', onRunning);
    process.on('SIGINT', () => this.end().then(process.exit, process.exit));
  }

  /**
   * Метрики времени
   * @namespace app.time
   * @type {{ started: number, running: ?number }}
   */


  /**
   * Список модулей для инициализации
   * @namespace app.modules
   * @type {Array<function>}
   */


  /**
   * Плагин транспорта по умолчанию
   * @namespace app.defaultTransportPlugin
   * @type {function}
   */


  /**
   * @namespace app.state
   * @type {string}
   */

  /**
   * @namespace app
   * @memberof app.on
   */
  /**
   * @namespace app
   * @memberof app.emit
   */

  /**
   * @namespace app.id
   * @type {string}
   */
}

exports.default = Microjs; /**
                            * @param {app} app
                            * @param {object} settings
                            */

function initialize(app, settings) {
  var _settings$id = settings.id;
  const id = _settings$id === undefined ? app.id : _settings$id;
  var _settings$name = settings.name;
  const name = _settings$name === undefined ? app.name : _settings$name;
  var _settings$level = settings.level;
  const level = _settings$level === undefined ? app.log.level : _settings$level;
  var _settings$plugins = settings.plugins;
  const plugins = _settings$plugins === undefined ? [] : _settings$plugins;
  var _settings$modules = settings.modules;
  const modules = _settings$modules === undefined ? app.modules : _settings$modules;
  var _settings$maxListener = settings.maxListeners;
  const maxListeners = _settings$maxListener === undefined ? _events2.default.defaultMaxListeners : _settings$maxListener;


  app.log.level = level;
  app.setMaxListeners(maxListeners);

  Object.assign(app, { id, name, settings });

  app.use(app.defaultLogPlugin({ level }));

  if (Array.isArray(plugins)) {
    plugins.forEach(plugin => app.use(plugin));
  }

  if (Array.isArray(modules)) {
    modules.forEach(module => app.use(module));
  }
}

function onRunning(app) {
  app.state = _constants.STATE_RUN;
  app.time.running = Date.now();
  app.log.info('App running', {
    app: {
      startedAt: (0, _dateIsoString2.default)(app.time.started),
      runningAt: (0, _dateIsoString2.default)(app.time.running)
    }
  });
}
//# sourceMappingURL=app.js.map