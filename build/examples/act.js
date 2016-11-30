'use strict';

var _ = require('./../');

var _2 = _interopRequireDefault(_);

var _logWinston = require('./../plugins/log-winston');

var _logWinston2 = _interopRequireDefault(_logWinston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const micro = (0, _2.default)().use((0, _logWinston2.default)());

micro.run().then(() => micro.act('cmd:ping')).then(result => micro.log.info(`ping - ${ result }`)).catch(micro.log.error);
//# sourceMappingURL=act.js.map