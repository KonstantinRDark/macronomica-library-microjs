'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _genid = require('./../../utils/genid');

var _genid2 = _interopRequireDefault(_genid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

exports.default = function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      settings = _objectWithoutProperties(_ref, []);

  return function (microjs, _ref2) {
    var onClose = _ref2.onClose;

    var plugin = { id: (0, _genid2.default)() };
    var logPin = 'cmd:logger, level:*';
    var logger = new _winston2.default.Logger({
      level: microjs.log.level,
      levels: microjs.log.LEVELS
    });

    logger.add(_winston2.default.transports.Console);

    microjs.add(logPin, function (_ref3) {
      var cmd = _ref3.cmd,
          level = _ref3.level,
          message = _ref3.message,
          payload = _ref3.payload;
      return logger[level](message, payload);
    });

    onClose(function () {
      logger = null;
      microjs.del(logPin);
    });

    return plugin;
  };
};
//# sourceMappingURL=index.js.map