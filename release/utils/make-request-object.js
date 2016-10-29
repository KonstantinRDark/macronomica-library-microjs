'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _genid = require('./genid');

var _genid2 = _interopRequireDefault(_genid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      id = _ref.id,
      actionId = _ref.actionId;

  return {
    id: id || (0, _genid2.default)(),
    actionId: actionId,
    time: {
      hrtime: process.hrtime(),
      start: Date.now()
    }
  };
};
//# sourceMappingURL=make-request-object.js.map
