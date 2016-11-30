'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getNextCallback;

var _lodash = require('lodash.isfunction');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getNextCallback(args) {
  let next = args.pop();

  if (!(0, _lodash2.default)(next)) {
    args.push(next);
    next = () => {};
  }

  return next;
}
//# sourceMappingURL=get-next-callback.js.map