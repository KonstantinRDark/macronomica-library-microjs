'use strict';

var _ = require('./../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var micro = (0, _2.default)().add('cmd:ping', function () {
  console.log('pong');
  return 'pong';
});

micro.run(function () {
  micro.act('cmd:ping').then(function (result) {
    return console.log(result);
  });
});
//# sourceMappingURL=all.js.map