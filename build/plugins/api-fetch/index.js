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
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  let name = _ref.name,
      settings = _objectWithoutProperties(_ref, ['name']);

  return (app, _ref2) => {
    let onClose = _ref2.onClose;

    const apiPin = `api:${ name }`;
    const executeApi = (0, _fetch2.default)(app, _extends({ name }, settings));

    app.add(apiPin, executeApi);

    onClose(() => app.del(apiPin));

    return Promise.resolve();
  };
}
//# sourceMappingURL=index.js.map