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
   * Список подписчиков
   * @namespace app.subscribers
   * @type {{ run: Array<function>, add: Array<function>, end: Array<function> }}
   */


  /**
   * @namespace app.state
   * @type {string}
   */
  constructor() {
    let settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    super();
    this.id = (0, _genid2.default)();
    this.state = _constants.STATE_START;
    this.manager = (0, _patrun2.default)({ gex: true });
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
    const id = settings.id;
    var _settings$maxListener = settings.maxListeners;
    const maxListeners = _settings$maxListener === undefined ? _events2.default.defaultMaxListeners : _settings$maxListener;


    if (!!id) {
      this.id = id;
    }

    this.settings = settings;
    this.setMaxListeners(maxListeners);

    this.on('running', app => {
      app.state = _constants.STATE_RUN;
      app.time.running = Date.now();
      app.log.info(['\n', '##############################################################################################', '# Micro started', '# ===========================================================================================', '# Instance  : ' + app.id, `# Started At: ${ (0, _dateIsoString2.default)(app.time.started) }`, `# Running At: ${ (0, _dateIsoString2.default)(app.time.running) }`, '##############################################################################################'].join('\n'));
    });
  }

  /**
   * Метрики времени
   * @namespace app.time
   * @type {{ started: number, running: ?number }}
   */


  /**
   * @namespace app.manager
   * @type {object}
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
exports.default = Microjs;
//# sourceMappingURL=app.js.map