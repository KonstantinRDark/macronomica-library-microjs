'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _listen2 = require('./listen');

var _listen3 = _interopRequireDefault(_listen2);

var _client2 = require('./client');

var _client3 = _interopRequireDefault(_client2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var defaultOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function (micro, name, pluginId) {
    var handleListen = void 0;
    var handleClient = void 0;
    var plugin = { name: name, id: pluginId };

    micro.queue({
      case: 'wait',
      args: [],
      done: function done() {
        return !handleListen ? Promise.resolve() : handleListen.listen();
      }
    }).queue({
      case: 'close',
      args: [],
      done: function done() {
        return !handleListen ? Promise.resolve() : handleListen.close();
      }
    });

    return {
      listen: function listen() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return handleListen = (0, _listen3.default)(micro, plugin, _extends({}, defaultOptions, options));
      },
      client: function client() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return handleClient = (0, _client3.default)(micro, plugin, _extends({}, defaultOptions, options));
      }
    };
  };
};
//# sourceMappingURL=index.js.map
