import isPlainObject from 'lodash.isplainobject';
import jsonic from 'jsonic';

const transformer = function transformer(logData) {
  const transformed = {};
  transformed[ '@timestamp' ] = logData.timestamp ? logData.timestamp : new Date().toISOString();
  transformed.message = logData.message;
  transformed.severity = logData.level;
  
  const { pin, action, plugin, ...other } = logData.meta;
  
  transformed.fields = {
    pin   : isPlainObject(pin) ? jsonic.stringify(pin) : pin,
    plugin: isPlainObject(plugin) ? jsonic.stringify(plugin) : plugin,
    action: isPlainObject(action) ? jsonic.stringify(action) : action,
    ...other
  };
  
  return transformed;
};

module.exports = transformer;
