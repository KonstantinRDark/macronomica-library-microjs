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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Статус блокирует
const STATE_INIT = 'init';
const STATE_WAIT = 'wait';
const STATE_RUN = 'run';
const STATE_END = 'run';

/**
 * @namespace app
 * @class Microjs
 * @augments EventEmitter
 */
class Microjs extends _events2.default {
  /**
   * @namespace app.manager
   * @type {object}
   */
  constructor() {
    let settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    super();
    this.state = STATE_INIT;
    this.manager = (0, _patrun2.default)({ gex: true });
    this.subscribers = {
      run: [], // подписчики для этапа запуска работы
      end: [] // подписчики для этапа завершения работы
    };
    this.log = (0, _log2.default)(this);
    this.use = (0, _use2.default)(this);
    this.add = (0, _add2.default)(this);
    this.del = (0, _del2.default)(this);
    this.api = (0, _api2.default)(this);
    this.act = (0, _act2.default)(this);
    this.end = (0, _end2.default)(this);
    this.run = (0, _run2.default)(this);
    var _settings$id = settings.id;
    const id = _settings$id === undefined ? (0, _genid2.default)() : _settings$id;
    var _settings$maxListener = settings.maxListeners;
    const maxListeners = _settings$maxListener === undefined ? _events2.default.defaultMaxListeners : _settings$maxListener;


    this.id = id;
    this.settings = settings;
    this.setMaxListeners(maxListeners);
  }
  /**
   * Список подписчиков
   * @namespace app.subscribers
   * @type {{ run: Array<function>, end: Array<function> }}
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
   * @namespace app.state
   * @type {string}
   */
}
exports.default = Microjs;
//# sourceMappingURL=app.js.map