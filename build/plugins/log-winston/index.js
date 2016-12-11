'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

require('winston-elasticsearch');

var _genid = require('./../../utils/genid');

var _genid2 = _interopRequireDefault(_genid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

exports.default = function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  let level = _ref.level,
      settings = _objectWithoutProperties(_ref, ['level']);

  return (micro, _ref2) => {
    let onClose = _ref2.onClose;

    const plugin = { id: (0, _genid2.default)() };

    let logger = new _winston2.default.Logger(_extends({
      level: level || micro.log.level,
      levels: micro.log.LEVELS
    }, settings));

    if (process.env.NODE_ENV === 'production' && _config2.default.has('plugins.winston-elasticsearch')) {
      var _config$get = _config2.default.get('plugins.winston-elasticsearch'),
          _config$get$clientOpt = _config$get.clientOpts;

      let clientOpts = _config$get$clientOpt === undefined ? {} : _config$get$clientOpt,
          loggerSettings = _objectWithoutProperties(_config$get, ['clientOpts']);

      logger.add(_winston2.default.transports.Elasticsearch, _extends({
        consistency: false,
        mappingTemplate: require('./elasticsearch-template.json')
      }, loggerSettings, {
        level: level || micro.log.level,
        clientOpts: _extends({
          log: [{
            type: 'stdio',
            levels: ['error', 'warning']
          }]
        }, clientOpts)
      }));
    } else {
      logger.add(_winston2.default.transports.Console, {
        label: micro.id
      });
    }

    micro.emit('plugin.logger.use');
    micro.on('log', (_ref3) => {
      let level = _ref3.level,
          message = _ref3.message,
          payload = _ref3.payload;
      return logger[level](message, payload);
    });

    return plugin;
  };
};
//# sourceMappingURL=index.js.map