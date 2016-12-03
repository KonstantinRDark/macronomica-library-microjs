import internalError from './internal-error';

export default (app, info = {}) => {
  return (outError) => internalError(app, outError, info);
};