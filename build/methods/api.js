'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = api;

var _apiFetch = require('./../plugins/api-fetch');

var _apiFetch2 = _interopRequireDefault(_apiFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function api(microjs) {
  return function (name) {
    var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return microjs.use((0, _apiFetch2.default)(_extends({ name: name }, settings)));
  };
}
//# sourceMappingURL=api.js.map