'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash.isfunction');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = function (micro, result) {
  if ((0, _lodash2.default)(result)) {
    return Array.isArray(micro) ? result.apply(undefined, _toConsumableArray(micro)) : result(micro);
  }

  return result;
};
//# sourceMappingURL=provide-call.js.map
