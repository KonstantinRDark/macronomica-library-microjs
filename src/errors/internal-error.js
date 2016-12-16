import error, { ERROR_INTERNAL_ERROR } from './error';

export default (app, outError, info = {}) => {
  const e = error({ message: ERROR_INTERNAL_ERROR, ...info });
  app.log.error(e.message, { error: outError });
  return e;
};