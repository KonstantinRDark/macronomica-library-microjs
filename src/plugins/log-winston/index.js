import winston from 'winston';
import 'winston-elasticsearch';
import genid from './../../utils/genid';

export default ({ level, ...settings } = {}) => {
  return (micro, { onClose }) => {
    const plugin = { id: genid() };
    const config = require('config');
    let logger = new (winston.Logger)({
      level : level || micro.log.level,
      levels: micro.log.LEVELS,
      ...settings
    });

    if (process.env.NODE_ENV === 'production' && config.has('plugins.winston-elasticsearch')) {
      let { clientOpts = {}, ...loggerSettings } = config.get('plugins.winston-elasticsearch');

      logger.add(winston.transports.Elasticsearch, {
        consistency    : false,
        mappingTemplate: require('./elasticsearch-template.json'),
        transformer    : require('./elasticsearch-transformer'),
        ...loggerSettings,
        level          : level || micro.log.level,
        clientOpts     : {
          log: [{
            type  : 'stdio',
            levels: ['error', 'warning']
          }],
          ...clientOpts
        }
      });
    } else {
      logger.add(winston.transports.Console, ({
        label: micro.id
      }));
    }

    micro.emit('plugin.logger.use');
    micro.on('log', ({ level, message, meta }) => logger[ level ](message, meta));

    return plugin;
  }
};