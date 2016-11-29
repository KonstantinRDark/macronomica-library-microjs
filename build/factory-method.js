'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = factoryMethod;

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

function factoryMethod(listenSettings) {
  var initSubscribers = [];
  var closeSubscribers = [];

  var microjs = {};
  var manager = (0, _patrun2.default)({ gex: true });

  Object.assign(microjs, {
    log: (0, _log2.default)(microjs),
    use: (0, _use2.default)(microjs, initSubscribers),
    add: (0, _add2.default)(microjs, manager),
    del: (0, _del2.default)(microjs, manager),
    api: (0, _api2.default)(microjs),
    act: (0, _act2.default)(microjs, manager),
    end: (0, _end2.default)(microjs, closeSubscribers),
    run: (0, _run2.default)(microjs, initSubscribers, closeSubscribers, listenSettings)
  });

  return microjs;
}
//# sourceMappingURL=factory-method.js.map