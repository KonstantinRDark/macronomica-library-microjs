'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clear = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _lodash = require('lodash.isstring');

var _lodash2 = _interopRequireDefault(_lodash);

var _jsonic = require('jsonic');

var _jsonic2 = _interopRequireDefault(_jsonic);

var _package = require('../../package.json');

var _genid = require('./genid');

var _genid2 = _interopRequireDefault(_genid);

var _mdnDecimalAdjust = require('./mdn-decimal-adjust');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
        msg = (0, _objectWithoutProperties3.default)(_raw, ['appId', 'appName', 'log', 'transport', 'request']);


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

  (0, _assign2.default)(req, (0, _extends3.default)({
    transport,
    request: (0, _extends3.default)({
      id: (0, _genid2.default)()
    }, request, {
      time: {
        hrtime: process.hrtime(),
        start: Date.now()
      }
    })
  }, msg, {
    duration,
    act: pin => {
      if ((0, _lodash2.default)(pin)) {
        pin = (0, _jsonic2.default)(pin);
      }

      return app.act((0, _extends3.default)({}, pin, {
        request: req.request,
        transport: req.transport
      }));
    }
  }));

  return req;

  function duration() {
    var _process$hrtime = process.hrtime(req.request.time.hrtime),
        _process$hrtime2 = (0, _slicedToArray3.default)(_process$hrtime, 2);

    const seconds = _process$hrtime2[0],
          nanoseconds = _process$hrtime2[1];

    req.request.time.end = Date.now();
    return req.request.time.duration = (0, _mdnDecimalAdjust.round)(seconds * 1000 + nanoseconds * 1e-6, -3);
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
      msg = (0, _objectWithoutProperties3.default)(_ref, ['appId', 'appName', 'log', 'duration', 'act', 'transport', 'request']);

  return msg;
}
//# sourceMappingURL=make-request.js.map