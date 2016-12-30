'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = getRequest;

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _makeRequest = require('./../../../../utils/make-request');

var _makeRequest2 = _interopRequireDefault(_makeRequest);

var _constants = require('./../../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const type = 'http';

function getRequest(app, req, pin) {
  const request = (0, _makeRequest2.default)(app, (0, _extends3.default)({
    transport: getTransport(app, req)
  }, pin));

  if (_constants.SERVER_REQUEST_HEADER in req.headers) {
    request.request = (0, _extends3.default)({}, request.request, _jsonwebtoken2.default.verify(req.headers[_constants.SERVER_REQUEST_HEADER], _constants.SERVER_SECRET).request);
  }

  return request;
}

function getTransport(app, req) {
  const transport = {
    type,
    origin: req.headers['user-agent'],
    method: req.method,
    time: Date.now()
  };

  if (_constants.SERVER_TRANSPORT_HEADER in req.headers) {
    var _jwt$verify$transport = _jsonwebtoken2.default.verify(req.headers[_constants.SERVER_TRANSPORT_HEADER], _constants.SERVER_SECRET).transport;

    let type = _jwt$verify$transport.type,
        other = (0, _objectWithoutProperties3.default)(_jwt$verify$transport, ['type']);

    (0, _assign2.default)(transport, other);
  }

  transport.trace = [...(transport.trace || []), app.name];

  return transport;
}
//# sourceMappingURL=get-request.js.map