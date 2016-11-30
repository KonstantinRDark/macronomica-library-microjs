'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = factoryMethod;

var _patrun = require('patrun');

var _patrun2 = _interopRequireDefault(_patrun);

var _defer = require('./utils/defer');

var _defer2 = _interopRequireDefault(_defer);

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
var STATE_INIT = 'init';
var STATE_WAIT = 'wait';
var STATE_RUN = 'run';
var STATE_END = 'run';
/**
 * @param {object} listenSettings
 * @returns {app}
 */
function factoryMethod(listenSettings) {
  /**
   * @namespace app
   */
  var app = {
    /**
     * @type {string}
     */
    state: STATE_INIT,
    /**
     * @type {object}
     */
    manager: (0, _patrun2.default)({ gex: true }),
    /**
     * Список подписчиков
     * @type {{ run: Array<function>, end: Array<function> }}
     */
    subscribers: {
      run: [], // подписчики для этапа запуска работы
      end: [] // подписчики для этапа завершения работы
    }
  };

  Object.assign(app, {
    log: (0, _log2.default)(app),
    use: (0, _use2.default)(app),
    add: (0, _add2.default)(app),
    del: (0, _del2.default)(app),
    api: (0, _api2.default)(app),
    act: (0, _act2.default)(app),
    end: (0, _end2.default)(app),
    run: (0, _run2.default)(app, listenSettings)
  });

  return app;
}
//# sourceMappingURL=factory-method.js.map