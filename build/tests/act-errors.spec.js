'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _typed = require('error/typed');

var _typed2 = _interopRequireDefault(_typed);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _ = require('../');

var _2 = _interopRequireDefault(_);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const should = _chai2.default.should();
const innerTimeout = 100;
const micro = (0, _2.default)({ level: _.LEVEL_WARN });

before(() => micro.add('cmd:act-internal-error', request => {
  request.test.test;
}).add('cmd:act-catch-error', request => new _promise2.default((resolve, reject) => {
  const error = (0, _typed2.default)({
    message: '{name}: User {userId} not found',
    type: 'user.not.found',
    userId: null
  });

  reject(error({ userId: 1 }));
})).add('cmd:act-timeout-inner-error', request => new _promise2.default((resolve, reject) => {
  setTimeout(() => resolve(), innerTimeout + 10);
})).add('cmd:act-timeout-error', request => new _promise2.default((resolve, reject) => {
  setTimeout(() => resolve(), _constants.ACT_TIMEOUT + 10);
})).run());
after(() => micro.end());

describe('act-errors', function () {

  it('#act not found error', () => micro.act('cmd:act-not-found-error').catch(error => error.type.should.equal(`micro.act.not.found`)));

  it('#throw error as internal error', () => micro.act('cmd:act-internal-error').catch(error => error.type.should.equal(`micro.act.internal`)));

  it('#catch error', () => micro.act('cmd:act-catch-error').catch(error => error.type.should.equal(`user.not.found`)));

  it('#timeout error to ACT_TIMEOUT', () => micro.act({ cmd: 'act-timeout-error' }).catch(error => error.type.should.equal(`micro.act.timeout`)));

  it('#timeout error to act', () => micro.act({ cmd: 'act-timeout-inner-error', timeout: innerTimeout }).catch(error => error.type.should.equal(`micro.act.timeout`)));
});
//# sourceMappingURL=act-errors.spec.js.map