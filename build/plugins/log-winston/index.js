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

  return function (micro, _ref2) {
    var onClose = _ref2.onClose;

    var plugin = { id: (0, _genid2.default)() };

    var logger = new _winston2.default.Logger({
      level: micro.log.level,
      levels: micro.log.LEVELS
    });

    logger.add(_winston2.default.transports.Console);

    micro.emit('plugin.logger.use');
    micro.on('log', function (_ref3) {
      var level = _ref3.level,
          message = _ref3.message,
          payload = _ref3.payload;
      return logger[level](message, payload);
    });

    onClose(function () {
      micro.emit('plugin.logger.unuse');
      logger = null;
    });

    return plugin;
  };
};
//# sourceMappingURL=index.js.map