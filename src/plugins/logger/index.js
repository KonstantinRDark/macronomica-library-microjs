import winston from 'winston';
import {serialize} from 'winston/lib/winston/common';
import dateIsoString from './../../utils/date-iso-string';

export default ({ name = 'micro', level = 'silly' } = {}) => micro => {
  return winston.loggers.add(name, {
    transports: [
      new (winston.transports.Console)({
        level,
        colorize : true,
        label    : name,
        timestamp: () => Date.now(),
        formatter: function({ level, message, ...options } = {}) {
          const appId = micro.id;
          const hasMeta = options.meta && Object.keys(options.meta).length;
          const when  = hasMeta && options.meta.when ? options.meta.when : options.timestamp();
          
          if (undefined !== message && !hasMeta) {
            return message;
          }

          const format = [
            `\x1b[90m${ dateIsoString(when) }\x1b[0m`,
            `[${ level.toUpperCase() }]`
          ];

          if (hasMeta) {
            let { actionId, id, action } = options.meta;
            let output = `\x1b[90m${ appId }`;

            if (actionId) output += ` (${ actionId })`;
            output += '\x1b[0m';
  
            if (id) output += ` (${ id })`;
            if (action) output += ` ${ action }`;

            format.push(output)
          }

          if (undefined !== message) {
            format.push(message);
          }

          if (hasMeta) {
            const { payload, error, time } = options.meta;
            if (error || payload) format.push(serialize(error || payload));
            if (time) format.push(serialize(time));
          }

          // Return string will be passed to logger.
          return `${ format.join('\t') }`;
        }
      })
    ]
  });
};