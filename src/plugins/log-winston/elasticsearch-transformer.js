import isPlainObject from 'lodash.isplainobject';
import jsonic from 'jsonic';

const transformer = function transformer({
  timestamp = new Date().toISOString(),
  message,
  level:severity,
  meta = {}
}) {
  const { pin, action, plugin, ...other } = meta;
  const fields = {
    ...other
  };
  
  add(fields, 'pin', pin);
  add(fields, 'plugin', plugin);
  add(fields, 'action', action);
  
  return {
    '@timestamp': timestamp,
    message,
    severity,
    fields
  };
};

module.exports = transformer;

function add(fields, name, value) {
  if (value) {
    fields[ name ] = JSON.stringify(value);
  }
}
