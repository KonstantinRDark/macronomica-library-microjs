'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash.isplainobject');

var _lodash2 = _interopRequireDefault(_lodash);

var _jsonic = require('jsonic');

var _jsonic2 = _interopRequireDefault(_jsonic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const transformer = function transformer(logData) {
  const transformed = {};
  transformed['@timestamp'] = logData.timestamp ? logData.timestamp : new Date().toISOString();
  transformed.message = logData.message;
  transformed.severity = logData.level;

  var _logData$meta = logData.meta;

  const pin = _logData$meta.pin,
        action = _logData$meta.action,
        plugin = _logData$meta.plugin,
        other = _objectWithoutProperties(_logData$meta, ['pin', 'action', 'plugin']);

  transformed.fields = _extends({
    pin: (0, _lodash2.default)(pin) ? _jsonic2.default.stringify(pin) : pin,
    plugin: (0, _lodash2.default)(plugin) ? _jsonic2.default.stringify(plugin) : plugin,
    action: (0, _lodash2.default)(action) ? _jsonic2.default.stringify(action) : action
  }, other);

  return transformed;
};

module.exports = transformer;
//# sourceMappingURL=elasticsearch-transformer.js.map