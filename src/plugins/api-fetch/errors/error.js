export const ERROR_SEPARATOR = ':';
export const ERROR_PREFIX = 'error.plugin-dal';

export const ERROR_SSH_SETTINGS_INCORRECT = 'ssh.user.settings.incorrect';

export default ({ module = 'plugin-api-fetch', action = '-', message = '-' }) => {
  return new Error([
    ERROR_PREFIX,
    module,
    action,
    message
  ].join(ERROR_SEPARATOR));
};