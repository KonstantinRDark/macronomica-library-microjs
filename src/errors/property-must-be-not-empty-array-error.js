import error, { ERROR_PROPERTY_MUST_BE_NOT_EMPTY_ARRAY } from './error';

export default ({ property, ...info }) => {
  return error({
    message: `property.${ property }.${ ERROR_PROPERTY_MUST_BE_NOT_EMPTY_ARRAY }`,
    ...info
  });
};