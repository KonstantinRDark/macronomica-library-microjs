'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

require('winston-elasticsearch');

var _genid = require('./../../utils/genid');

var _genid2 = _interopRequireDefault(_genid);

var _formatter2 = require('./formatter');

var _formatter3 = _interopRequireDefault(_formatter2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  let level = _ref.level,
      settings = (0, _objectWithoutProperties3.default)(_ref, ['level']);

  return (micro, _ref2) => {
    let onClose = _ref2.onClose;

    const plugin = { id: (0, _genid2.default)() };
    const config = require('config');
    let logger = new _winston2.default.Logger((0, _extends3.default)({
      level: level || micro.log.level,
      levels: micro.log.LEVELS
    }, settings));

    if (process.env.NODE_ENV === 'production' && config.has('plugins.winston-elasticsearch')) {
      var _config$get = config.get('plugins.winston-elasticsearch'),
          _config$get$clientOpt = _config$get.clientOpts;

      let clientOpts = _config$get$clientOpt === undefined ? {} : _config$get$clientOpt,
          loggerSettings = (0, _objectWithoutProperties3.default)(_config$get, ['clientOpts']);


      logger.add(_winston2.default.transports.Elasticsearch, (0, _extends3.default)({
        consistency: false,
        mappingTemplate: require('./elasticsearch-template.json'),
        transformer: _formatter3.default
      }, loggerSettings, {
        level: level || micro.log.level,
        clientOpts: (0, _extends3.default)({
          log: [{
            type: 'stdio',
            levels: ['error', 'warning']
          }]
        }, clientOpts)
      }));
    } else {
      logger.add(_winston2.default.transports.Console, {
        label: micro.id,
        formatter: options => {
          var _formatter = (0, _formatter3.default)(options);

          const severity = _formatter.severity,
                message = _formatter.message;
          var _formatter$fields = _formatter.fields;
          _formatter$fields = _formatter$fields === undefined ? {} : _formatter$fields;
          const error = _formatter$fields.error,
                fields = (0, _objectWithoutProperties3.default)(_formatter$fields, ['error']),
                timestamp = _formatter['@timestamp'],
                other = (0, _objectWithoutProperties3.default)(_formatter, ['severity', 'message', 'fields', '@timestamp']);


          other.fields = fields;

          let result = [_util2.default.format(`[${ severity }] ${ message }: %j`, other)];

          if (error) {
            result.push(_util2.default.format(`[${ severity }] %s`, error));
          }

          return result.join('\n');
        }
      });
    }

    micro.emit('plugin.logger.use');
    micro.on('log', (_ref3) => {
      let level = _ref3.level,
          message = _ref3.message,
          meta = _ref3.meta;
      return logger[level](message, meta);
    });

    return plugin;
  };
};
//# sourceMappingURL=index.js.map