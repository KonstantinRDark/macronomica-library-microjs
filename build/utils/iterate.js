'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _getNextCallback = require('./get-next-callback');

var _getNextCallback2 = _interopRequireDefault(_getNextCallback);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (raw) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return iterate((0, _getIterator3.default)(raw), ...args);
};

function iterate(iterator) {
  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  const preprocessor = iterator.next();
  let next = (0, _getNextCallback2.default)(args);

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
//# sourceMappingURL=iterate.js.map