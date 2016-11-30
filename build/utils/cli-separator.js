'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * @param sub
 * @param separator
 * @param subSeparator
 * @param length
 */
exports.default = function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$sub = _ref.sub,
      sub = _ref$sub === undefined ? false : _ref$sub,
      _ref$separator = _ref.separator,
      separator = _ref$separator === undefined ? '#' : _ref$separator,
      _ref$subSeparator = _ref.subSeparator,
      subSeparator = _ref$subSeparator === undefined ? '-' : _ref$subSeparator,
      _ref$length = _ref.length,
      length = _ref$length === undefined ? 80 : _ref$length;

  var arr = new Array(length - (sub ? 2 : 0));
  return (sub ? separator + ' ' : '') + arr.join(sub ? subSeparator : separator);
};
//# sourceMappingURL=cli-separator.js.map