'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash.isstring');

var _lodash2 = _interopRequireDefault(_lodash);

var _jsonic = require('jsonic');

var _jsonic2 = _interopRequireDefault(_jsonic);

var _makeRequestObject = require('./make-request-object');

var _makeRequestObject2 = _interopRequireDefault(_makeRequestObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

exports.default = function (raw) {
  raw = (0, _lodash2.default)(raw) ? (0, _jsonic2.default)(raw) : raw;

  var _raw = raw,
      transport = _raw.transport,
      request = _raw.request,
      params = _objectWithoutProperties(_raw, ['transport', 'request']);

  return {
    params: params,
    transport: transport,
    request: request || (0, _makeRequestObject2.default)()
  };
};
//# sourceMappingURL=make-msg.js.map
