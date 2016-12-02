'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const ERROR_SEPARATOR = exports.ERROR_SEPARATOR = ':';
const ERROR_PREFIX = exports.ERROR_PREFIX = 'error.plugin-dal';

const ERROR_SSH_SETTINGS_INCORRECT = exports.ERROR_SSH_SETTINGS_INCORRECT = 'ssh.user.settings.incorrect';

exports.default = (_ref) => {
  var _ref$module = _ref.module;
  let module = _ref$module === undefined ? 'plugin-api-fetch' : _ref$module;
  var _ref$action = _ref.action;
  let action = _ref$action === undefined ? '-' : _ref$action;
  var _ref$message = _ref.message;
  let message = _ref$message === undefined ? '-' : _ref$message;

  return new Error([ERROR_PREFIX, module, action, message].join(ERROR_SEPARATOR));
};
//# sourceMappingURL=error.js.map