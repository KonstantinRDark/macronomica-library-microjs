'use strict';

var _ = require('./../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const micro = (0, _2.default)();

micro.add({
  action: 'update', // точное значение
  criteria: '*', // обязательный
  params: '?', // необязательный
  timeout: '?', // необязательный
  schema: '*', // обязательный

  __schema: {
    action: 'string:default=update,required',
    criteria: 'object:required',
    params: 'object',
    timeout: { '@type': 'number', default: 5000 },
    schema: {
      '@type': 'object',
      '@required': 'object',
      'type': Schema
    }
  },

  validate: {
    prefix: 'address.data',
    rules: [{
      type: '{prefix}.criteria.validate.error',
      code: 422,
      schema: {
        criteria: {
          id: 'string:required',
          '@required': true
        }
      }
    }, {
      type: '{prefix}.params.validate.error',
      code: 422,
      schema: {
        params: {
          name: 'string:required',
          slug: 'string:required'
        }
      }
    }]
  }
}, actionA);

function actionA() {}

function actionB() {}

micro.run().then(() => micro.act({ cmd: 'ping', validate: {} })).then(micro.log.info).catch(micro.log.error);
//# sourceMappingURL=validate.js.map