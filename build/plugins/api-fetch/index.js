'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = ApiFetchPlugin;

var _fetch = require('./methods/fetch');

var _fetch2 = _interopRequireDefault(_fetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function ApiFetchPlugin() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      name = _ref.name,
      settings = _objectWithoutProperties(_ref, ['name']);

  return function (microjs, _ref2) {
    var onClose = _ref2.onClose;

    var apiPin = 'api:' + name;
    var executeApi = (0, _fetch2.default)(microjs, _extends({ name: name }, settings));

    microjs.add(apiPin, executeApi);

    onClose(function () {
      return microjs.del(apiPin);
    });

    return new Promise(function (resolve, reject) {});
  };
}
//# sourceMappingURL=index.js.map