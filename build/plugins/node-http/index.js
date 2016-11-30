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

function NodeHttpPlugin() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      settings = _objectWithoutProperties(_ref, []);

  return function (app, _ref2) {
    var onClose = _ref2.onClose;

    var plugin = { id: (0, _genid2.default)() };
    app.emit('plugin.transport', TRANSPORT, (0, _listen2.default)(app, plugin, onClose, settings));
  };
}
//# sourceMappingURL=index.js.map