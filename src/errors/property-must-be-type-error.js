import error, { ERROR_PROPERTY_MUST_BE } from './error';

export default ({ property, type, ...info }) => {
  return error({
    message: `property.${ property }.${ ERROR_PROPERTY_MUST_BE }.${ type }`,
    ...info
  });
};