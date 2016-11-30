import winston from 'winston';
import genid from './../../utils/genid';

export default ({ label, ...settings } = {}) => {
  return (micro, { onClose }) => {
    const plugin = { id: genid() };

    let logger = new (winston.Logger)({
      level : micro.log.level,
      levels: micro.log.LEVELS,
      ...settings
    });

    logger.add(winston.transports.Console, ({
      label
    }));

    micro.emit('plugin.logger.use');
    micro.on('log', ({ level, message, payload }) => logger[ level ](message, payload));

    onClose(() => {
      micro.emit('plugin.logger.unuse');
      logger = null;
    });

    return plugin;
  }
};