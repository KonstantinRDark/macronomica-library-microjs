'use strict';

var _ = require('./../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const micro = (0, _2.default)();

micro.run().then(() => micro.act('cmd:ping')).then(micro.log.info).catch(micro.log.error);
//# sourceMappingURL=act.js.map