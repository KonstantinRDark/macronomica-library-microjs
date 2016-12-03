import error, { ERROR_PROPERTY_MUST_BE } from './error';

export default ({ property, types = [], ...info }) => {
  if (!Array.isArray(types)) {
    types = [ 'empty-types' ];
  }
  
  return error({
    message: `property.${ property }.${ ERROR_PROPERTY_MUST_BE }.${ types.join('.or.') }`,
    ...info
  });
};