'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const ERROR_SEPARATOR = exports.ERROR_SEPARATOR = ':';

const ERROR_INTERNAL_ERROR = exports.ERROR_INTERNAL_ERROR = 'internal.error';
const ERROR_PROPERTY_IS_REQUIRED = exports.ERROR_PROPERTY_IS_REQUIRED = 'property.is.required';

const ERROR_PROPERTY_MUST_BE = exports.ERROR_PROPERTY_MUST_BE = 'property.must.be';
const ERROR_PROPERTY_MUST_BE_NOT_EMPTY_ARRAY = exports.ERROR_PROPERTY_MUST_BE_NOT_EMPTY_ARRAY = 'must.be.not.empty.array';

exports.default = (_ref) => {
  var _ref$module = _ref.module;
  let module = _ref$module === undefined ? '-' : _ref$module;
  var _ref$action = _ref.action;
  let action = _ref$action === undefined ? '-' : _ref$action;
  var _ref$message = _ref.message;
  let message = _ref$message === undefined ? '-' : _ref$message;
  var _ref$plugin = _ref.plugin;
  let plugin = _ref$plugin === undefined ? '-' : _ref$plugin;

  // error:plugin-dal:module-list:action-find-one:internal.error
  return new Error(['error', `plugin-${ plugin }`, `module-${ module }`, `action-${ action }`, message].join(ERROR_SEPARATOR));
};
//# sourceMappingURL=error.js.map