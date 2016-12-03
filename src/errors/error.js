export const ERROR_SEPARATOR = ':';

export const ERROR_INTERNAL_ERROR = 'internal.error';
export const ERROR_PROPERTY_IS_REQUIRED = 'property.is.required';

export const ERROR_PROPERTY_MUST_BE = 'property.must.be';
export const ERROR_PROPERTY_MUST_BE_NOT_EMPTY_ARRAY = 'must.be.not.empty.array';

export default ({ module = '-', action = '-', message = '-', plugin = '-' }) => {
  // error:plugin-dal:module-list:action-find-one:internal.error
  return new Error([
    'error',
    `plugin-${ plugin }`,
    `module-${ module }`,
    `action-${ action }`,
    message
  ].join(ERROR_SEPARATOR));
};