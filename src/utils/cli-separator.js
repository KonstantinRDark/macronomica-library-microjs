/**
 * @param sub
 * @param separator
 * @param subSeparator
 * @param length
 */
export default ({
  sub = false,
  separator = '#',
  subSeparator = '-',
  length = 80
} = {}) => {
  const arr = new Array(length - (sub ? 2 : 0));
  return (sub ? `${ separator } ` : '') + arr.join(sub ? subSeparator : separator);
};