'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getNextCallback = require('./get-next-callback');

var _getNextCallback2 = _interopRequireDefault(_getNextCallback);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (raw) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return iterate.apply(undefined, [raw[Symbol.iterator]()].concat(args));
};

function iterate(iterator) {
  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  var preprocessor = iterator.next();
  var next = (0, _getNextCallback2.default)(args);

  if (preprocessor.done) {
    return next();
  }

  preprocessor.value.apply(preprocessor, args.concat([function (err) {
    if (err) {
      return next(err);
    }
    iterate.apply(undefined, [iterator].concat(args, [next]));
  }]));
}
//# sourceMappingURL=iterate.js.map