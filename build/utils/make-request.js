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

exports.clear = clear;

exports.default = (app, raw) => {
  if ((0, _lodash2.default)(raw)) {
    raw = (0, _jsonic2.default)(raw);
  }

  const TRANSPORT = {
    type: 'inner',
    trace: [],
    origin: `microjs-${app.name !== 'microjs' ? app.name : ''}-v${_package.version}`
  };

  var _clearOldRequest = clearOldRequest(raw),
      _clearOldRequest$tran = _clearOldRequest.transport;

  const transport = _clearOldRequest$tran === undefined ? TRANSPORT : _clearOldRequest$tran,
        request = _clearOldRequest.request,
        msg = (0, _objectWithoutProperties3.default)(_clearOldRequest, ['transport', 'request']);

  const req = newReq(app);

  (0, _assign2.default)(req, (0, _extends3.default)({}, msg, {
    transport,
    duration,
    request: wrapRequest(request),
    act: pin => {
      if ((0, _lodash2.default)(pin)) {
        pin = (0, _jsonic2.default)(pin);
      }
      const request = req.request,
            transport = req.transport;

      return app.act((0, _extends3.default)({}, pin, { request, transport }));
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

function wrapRequest() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  let parent = _ref.original,
      oId = _ref.owner;
  var _ref$trace = _ref.trace;
  let trace = _ref$trace === undefined ? [] : _ref$trace;

  const original = (0, _genid2.default)();
  const owner = oId || original;
  const start = Date.now();
  const hrtime = process.hrtime();
  const id = [owner + (original !== owner || !!parent ? ':~:' : ''), !!parent ? parent + '~>~' : '', original !== owner ? original : ''].join('');

  trace = !!parent ? [...trace, original] : [];

  return {
    id,
    time: { hrtime, start },
    original,
    parent,
    owner,
    trace
  };
}

function newReq(app) {
  return {
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
}

function clearOldRequest(_ref2) {
  let appId = _ref2.appId,
      appName = _ref2.appName,
      log = _ref2.log,
      duration = _ref2.duration,
      act = _ref2.act,
      msg = (0, _objectWithoutProperties3.default)(_ref2, ['appId', 'appName', 'log', 'duration', 'act']);

  return msg;
}

function clear() {
  var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  let appId = _ref3.appId,
      appName = _ref3.appName,
      log = _ref3.log,
      duration = _ref3.duration,
      act = _ref3.act,
      transport = _ref3.transport,
      request = _ref3.request,
      msg = (0, _objectWithoutProperties3.default)(_ref3, ['appId', 'appName', 'log', 'duration', 'act', 'transport', 'request']);

  return msg;
}
//# sourceMappingURL=make-request.js.map