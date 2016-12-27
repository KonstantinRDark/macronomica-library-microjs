import util from 'util';
import winston from 'winston';
import 'winston-elasticsearch';
import genid from './../../utils/genid';
import formatter from './formatter';

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
        transformer    : formatter,
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
        label    : micro.id,
        formatter: options => {
          const {
            severity,
            message,
            fields: { error, ...fields } = {},
            '@timestamp':timestamp,
            ...other
          } = formatter(options);

          other.fields = fields;

          let result = [
            util.format(`[${ severity }] ${ message }: %j`, other)
          ];

          if (error) {
            result.push(util.format(`[${ severity }] %s`, error));
          }

          return result.join('\n');
        }
      }));
    }

    micro.emit('plugin.logger.use');
    micro.on('log', ({ level, message, meta }) => logger[ level ](message, meta));

    return plugin;
  }
};