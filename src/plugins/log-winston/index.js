import winston from 'winston';
import genid from './../../utils/genid';

export default ({ ...settings } = {}) => {
  return (microjs, { onClose }) => {
    const plugin = { id: genid() };
    const logPin = 'cmd:logger, level:*';
    let logger = new (winston.Logger)({
      level : microjs.log.level,
      levels: microjs.log.LEVELS
    });

    logger.add(winston.transports.Console);


    microjs.add(logPin, ({ cmd, level, message, payload }) => logger[ level ](message, payload));

    onClose(() => {
      logger = null;
      microjs.del(logPin);
    });

    return plugin;
  }
};