import TypedError from 'error/typed';
import chai from 'chai';
import Micro, { LEVEL_OFF, LEVEL_WARN } from '../';

const should = chai.should();

const micro = Micro({ level: LEVEL_WARN });

before(() => micro
  .add('cmd:act-internal-error', request => {
    request.test.test;
  })
  .add('cmd:act-catch-error', request => new Promise((resolve, reject) => {
    const error = TypedError({
      message: '{name}: User {userId} not found',
      type   : 'user.not.found',
      userId : null
    });

    reject(error({ userId: 1 }));
  }))
  .add('cmd:act-timeout-error', request => new Promise((resolve, reject) => {
    setTimeout(() => resolve(), 5100);
  }))
  .run()
);
after(() => micro.end());

describe('act-errors', function() {

  it('#act not found error', () => micro
    .act('cmd:act-not-found-error')
    .catch(error => error.type.should.equal(`micro.act.not.found`))
  );

  it('#throw error as internal error', () => micro
    .act('cmd:act-internal-error')
    .catch(error => error.type.should.equal(`micro.act.internal`))
  );

  it('#catch error', () => micro
    .act('cmd:act-catch-error')
    .catch(error => error.type.should.equal(`user.not.found`))
  );

  it('#timeout error', () => micro
      .act('cmd:act-timeout-error')
      .catch(error => error.type.should.equal(`micro.act.timeout`))
  );

});