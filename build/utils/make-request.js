'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clear = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash.isstring');

var _lodash2 = _interopRequireDefault(_lodash);

var _jsonic = require('jsonic');

var _jsonic2 = _interopRequireDefault(_jsonic);

var _package = require('../../package.json');

var _genid = require('./genid');

var _genid2 = _interopRequireDefault(_genid);

var _mdnDecimalAdjust = require('./mdn-decimal-adjust');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const TRANSPORT = {
  type: 'inner',
  trace: [],
  origin: `microjs-origin-v${ _package.version }`
};

exports.clear = clear;

exports.default = (app, raw) => {
  if ((0, _lodash2.default)(raw)) {
    raw = (0, _jsonic2.default)(raw);
  }

  var _raw = raw;
  const appId = _raw.appId,
        appName = _raw.appName,
        log = _raw.log;
  var _raw$transport = _raw.transport;
  const transport = _raw$transport === undefined ? TRANSPORT : _raw$transport;
  var _raw$request = _raw.request;

  const request = _raw$request === undefined ? {} : _raw$request,
        msg = _objectWithoutProperties(_raw, ['appId', 'appName', 'log', 'transport', 'request']);

  const req = {
    get appId() {
      return app.id;
    },

    get appName() {
      return app.name;
    },

    get log() {
      return app.log;
    }
  };

  return Object.assign(req, _extends({
    transport,
    request: _extends({
      id: (0, _genid2.default)()
    }, request, {
      time: {
        hrtime: process.hrtime(),
        start: Date.now()
      }
    })
  }, msg, {
    duration,
    act: function () {
      return app.act(...arguments);
    }
  }));

  function duration() {
    var _process$hrtime = process.hrtime(req.request.time.hrtime),
        _process$hrtime2 = _slicedToArray(_process$hrtime, 2);

    const seconds = _process$hrtime2[0],
          nanoseconds = _process$hrtime2[1];

    req.request.time.end = Date.now();
    return req.request.time.duration = (0, _mdnDecimalAdjust.round)(seconds * 1000 + nanoseconds * 1e-6, -3) + 'ms';
  }
};

function clear() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  let appId = _ref.appId,
      appName = _ref.appName,
      log = _ref.log,
      duration = _ref.duration,
      act = _ref.act,
      transport = _ref.transport,
      request = _ref.request,
      msg = _objectWithoutProperties(_ref, ['appId', 'appName', 'log', 'duration', 'act', 'transport', 'request']);

  return msg;
}
//# sourceMappingURL=make-request.js.map