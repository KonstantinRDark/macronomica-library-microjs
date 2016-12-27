'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (_ref) => {
  let property = _ref.property,
      type = _ref.type,
      info = (0, _objectWithoutProperties3.default)(_ref, ['property', 'type']);

  return (0, _error2.default)((0, _extends3.default)({
    message: `property.${ property }.${ _error.ERROR_PROPERTY_MUST_BE }.${ type }`
  }, info));
};
//# sourceMappingURL=property-must-be-type-error.js.map