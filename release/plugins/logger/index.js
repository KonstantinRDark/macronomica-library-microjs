'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _common = require('winston/lib/winston/common');

var _dateIsoString = require('./../../utils/date-iso-string');

var _dateIsoString2 = _interopRequireDefault(_dateIsoString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

exports.default = function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$name = _ref.name,
      name = _ref$name === undefined ? 'micro' : _ref$name,
      _ref$level = _ref.level,
      level = _ref$level === undefined ? 'silly' : _ref$level;

  return function (micro) {
    return _winston2.default.loggers.add(name, {
      transports: [new _winston2.default.transports.Console({
        level: level,
        colorize: true,
        label: name,
        timestamp: function timestamp() {
          return Date.now();
        },
        formatter: function formatter() {
          var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
              level = _ref2.level,
              message = _ref2.message,
              options = _objectWithoutProperties(_ref2, ['level', 'message']);

          var appId = micro.id;
          var hasMeta = options.meta && Object.keys(options.meta).length;
          var when = hasMeta && options.meta.when ? options.meta.when : options.timestamp();

          if (undefined !== message && !hasMeta) {
            return message;
          }

          var format = ['\x1B[90m' + (0, _dateIsoString2.default)(when) + '\x1B[0m', '[' + level.toUpperCase() + ']'];

          if (hasMeta) {
            var _options$meta = options.meta,
                actionId = _options$meta.actionId,
                id = _options$meta.id,
                action = _options$meta.action;

            var output = '\x1B[90m' + appId;

            if (actionId) output += ' (' + actionId + ')';
            output += '\x1b[0m';

            if (id) output += ' (' + id + ')';
            if (action) output += ' ' + action;

            format.push(output);
          }

          if (undefined !== message) {
            format.push(message);
          }

          if (hasMeta) {
            var _options$meta2 = options.meta,
                payload = _options$meta2.payload,
                error = _options$meta2.error,
                time = _options$meta2.time;

            if (error || payload) format.push((0, _common.serialize)(error || payload));
            if (time) format.push((0, _common.serialize)(time));
          }

          // Return string will be passed to logger.
          return '' + format.join('\t');
        }
      })]
    });
  };
};
//# sourceMappingURL=index.js.map
