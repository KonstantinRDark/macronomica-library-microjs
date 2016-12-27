'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typed = require('error/typed');

var _typed2 = _interopRequireDefault(_typed);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LevelUnsupportedError = (0, _typed2.default)({
  message: '{name} - не поддерживаемый уровень логирования (level={level})',
  type: `micro.modules.health-check.level.unsupported`,
  code: 500,
  level: null
});

exports.default = request => {
  const level = request.level;

  if (!(0, _keys2.default)(request.log.LEVELS).includes(level)) {
    return _promise2.default.resolve(LevelUnsupportedError({ level }));
  }

  return _promise2.default.resolve(request.log.level = level);
};
//# sourceMappingURL=set-level.js.map