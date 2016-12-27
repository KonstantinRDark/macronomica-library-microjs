const transformer = function transformer({
  timestamp = new Date().toISOString(),
  message,
  level:severity,
  meta = {}
}) {
  const { pin, action, plugin, app, request, ...other } = meta;
  const fields = {
    ...other
  };
  
  add(fields, 'pin', pin);
  add(fields, 'plugin', plugin);
  add(fields, 'action', action);
  
  return {
    message,
    severity,
    app,
    fields,
    '@timestamp': timestamp,
    request     : !request ? undefined : request
  };
};

module.exports = transformer;

function add(fields, name, value) {
  if (value) {
    fields[ name ] = JSON.stringify(value);
  }
}
