'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = NodeHttpPlugin;

var _genid = require('./../../utils/genid');

var _genid2 = _interopRequireDefault(_genid);

var _listen = require('./methods/listen');

var _listen2 = _interopRequireDefault(_listen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var TRANSPORT = 'http';

function NodeHttpPlugin(_ref) {
  var settings = _objectWithoutProperties(_ref, []);

  return function (microjs, _ref2) {
    var onClose = _ref2.onClose,
        manager = _ref2.manager;

    var plugin = { id: (0, _genid2.default)() };
    var getTransportPin = 'transport:' + TRANSPORT;
    var getTransportListenPin = 'transport:' + TRANSPORT + ', cmd:listen';

    microjs.add(getTransportPin, function getHttpTransportRoute() {
      return plugin;
    });
    microjs.add(getTransportListenPin, (0, _listen2.default)(microjs, plugin, onClose, settings));

    onClose(function () {
      return microjs.del(getTransportPin).del(getTransportListenPin);
    });
  };
}
//# sourceMappingURL=index.js.map