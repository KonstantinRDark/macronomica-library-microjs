'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = actProxyClientExec;

var _lodash = require('lodash.isstring');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function actProxyClientExec(micro, request) {
  return _extends({}, micro, {
    client: function client(name) {
      var api = micro.client(name);

      if ((0, _lodash2.default)(name)) {
        api = new Proxy(api, {
          get: function get(target, property) {
            var _original = target[property];
            return function () {
              for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              return _original.apply(undefined, args.concat([{ request: request }]));
            };
          }
        });
      }

      return api;
    }
  });
}
//# sourceMappingURL=act-proxy-client-exec.js.map
