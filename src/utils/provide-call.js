import isFunction from 'lodash.isfunction';

export default (micro, result) => {
  if (isFunction(result)) {
    return Array.isArray(micro)
      ? result(...micro)
      : result(micro);
  }

  return result;
};