'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _patrun = require('patrun');

var _patrun2 = _interopRequireDefault(_patrun);

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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Статус блокирует
var STATE_INIT = 'init';
var STATE_WAIT = 'wait';
var STATE_RUN = 'run';
var STATE_END = 'run';

/**
 * @namespace app
 * @class Microjs
 * @augments EventEmitter
 */

var Microjs = function (_EventEmitter) {
  _inherits(Microjs, _EventEmitter);

  /**
   * @namespace app.manager
   * @type {object}
   */
  function Microjs(settings) {
    _classCallCheck(this, Microjs);

    var _this = _possibleConstructorReturn(this, (Microjs.__proto__ || Object.getPrototypeOf(Microjs)).call(this));

    _this.state = STATE_INIT;
    _this.manager = (0, _patrun2.default)({ gex: true });
    _this.subscribers = {
      run: [], // подписчики для этапа запуска работы
      end: [] // подписчики для этапа завершения работы
    };
    _this.log = (0, _log2.default)(_this);
    _this.use = (0, _use2.default)(_this);
    _this.add = (0, _add2.default)(_this);
    _this.del = (0, _del2.default)(_this);
    _this.api = (0, _api2.default)(_this);
    _this.act = (0, _act2.default)(_this);
    _this.end = (0, _end2.default)(_this);
    _this.run = (0, _run2.default)(_this);

    _this.settings = settings;
    return _this;
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


  return Microjs;
}(_events2.default);

exports.default = Microjs;
//# sourceMappingURL=app.js.map