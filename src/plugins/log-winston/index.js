import config from 'config';
import winston from 'winston';
import 'winston-elasticsearch';
import genid from './../../utils/genid';

export default ({ level, ...settings } = {}) => {
  return (micro, { onClose }) => {
    const plugin = { id: genid() };

    let logger = new (winston.Logger)({
      level : level || micro.log.level,
      levels: micro.log.LEVELS,
      ...settings
    });

    if (config.has('plugins.winston-elasticsearch')) {
      let { clientOpts = {}, ...loggerSettings } = config.get('plugins.winston-elasticsearch');

      logger.add(winston.transports.Elasticsearch, {
        ...loggerSettings,
        clientOpts: {
          ...clientOpts
        }
      });
    } else {
      logger.add(winston.transports.Console, ({
        label: micro.id
      }));
    }

    micro.emit('plugin.logger.use');
    micro.on('log', ({ level, message, payload }) => logger[ level ](message, payload));

    return plugin;
  }
};