'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const transformer = function transformer(_ref) {
  var _ref$timestamp = _ref.timestamp;
  let timestamp = _ref$timestamp === undefined ? new Date().toISOString() : _ref$timestamp,
      message = _ref.message,
      severity = _ref.level;
  var _ref$meta = _ref.meta;
  let meta = _ref$meta === undefined ? {} : _ref$meta;
  const pin = meta.pin,
        action = meta.action,
        plugin = meta.plugin,
        app = meta.app,
        request = meta.request,
        other = (0, _objectWithoutProperties3.default)(meta, ['pin', 'action', 'plugin', 'app', 'request']);

  const fields = (0, _extends3.default)({}, other);

  add(fields, 'pin', pin);
  add(fields, 'plugin', plugin);
  add(fields, 'action', action);

  return {
    message,
    severity,
    app,
    fields,
    '@timestamp': timestamp,
    request: !request ? undefined : request
  };
};

module.exports = transformer;

function add(fields, name, value) {
  if (value) {
    fields[name] = (0, _stringify2.default)(value);
  }
}
//# sourceMappingURL=formatter.js.map