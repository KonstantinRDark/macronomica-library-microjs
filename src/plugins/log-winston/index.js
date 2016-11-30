import winston from 'winston';
import genid from './../../utils/genid';

export default ({ level, ...settings } = {}) => {
  return (micro, { onClose }) => {
    const plugin = { id: genid() };

    let logger = new (winston.Logger)({
      level : level || micro.log.level,
      levels: micro.log.LEVELS,
      ...settings
    });

    logger.add(winston.transports.Console, ({
      label: micro.id
    }));

    micro.emit('plugin.logger.use');
    micro.on('log', ({ level, message, payload }) => logger[ level ](message, payload));

    return plugin;
  }
};