import isFunction from 'lodash.isfunction';

export default function getNextCallback(args) {
  let next = args.pop();

  if (!isFunction(next)) {
    args.push(next);
    next = () => {};
  }

  return next;
}