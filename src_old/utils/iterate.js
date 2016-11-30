import getNextCallback from './get-next-callback';

export default (raw, ...args) => iterate(raw[ Symbol.iterator ](), ...args);

function iterate(iterator, ...args) {
  const preprocessor = iterator.next();
  let next = getNextCallback(args);
  
  if (preprocessor.done) {
    return next();
  }
  
  preprocessor.value(...args, function (err) {
    if (err) {
      return next(err);
    }
    iterate(iterator, ...args, next);
  });
}