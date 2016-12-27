'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports.default = NodeHttpPlugin;

var _genid = require('./../../utils/genid');

var _genid2 = _interopRequireDefault(_genid);

var _listen = require('./methods/listen');

var _listen2 = _interopRequireDefault(_listen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TRANSPORT = 'http';

function NodeHttpPlugin() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  let settings = (0, _objectWithoutProperties3.default)(_ref, []);

  return (app, _ref2) => {
    let onClose = _ref2.onClose;

    const plugin = { id: (0, _genid2.default)() };
    app.emit('plugin.transport', TRANSPORT, (0, _listen2.default)(app, plugin, onClose, settings));
  };
}
//# sourceMappingURL=index.js.map