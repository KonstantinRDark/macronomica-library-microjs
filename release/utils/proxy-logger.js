'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash.isplainobject');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (plugin) {
  return new Proxy(plugin, {
    get: function get(target, property) {
      var _original = target[property];

      return function () {
        var _ref;

        var meta = (_ref = arguments.length - 1, arguments.length <= _ref ? undefined : arguments[_ref]);

        if ((0, _lodash2.default)(meta)) {
          Object.assign(meta, {
            when: Date.now(),
            level: property
          });
        }
        return _original.apply(undefined, arguments);
      };
    }
  });
};
//# sourceMappingURL=proxy-logger.js.map
