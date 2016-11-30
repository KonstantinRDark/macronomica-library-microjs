import isString from 'lodash.isstring';
import clientGetter from './client-getter';
import clientSetter from './client-setter';

// Регистрирует клиента
export default (micro, clientOptions) => {
  if (isString(clientOptions)) {
    return clientGetter(micro, clientOptions);
  }
  
  const errors = [ 'name', 'type', 'host' ];
  let { host } = clientOptions;
  
  if (host === '0.0.0.0') {
    host = '127.0.0.1';
  }
  
  if ([ '127.0.0.1', 'localhost' ].includes(host)) {
    errors.push('port');
  }
  
  errors.some(property => {
    if (!clientOptions[ property ]) {
      const error = new TypeError(`При добавлении клиента свойство "${ property }" обязательно`);
      error.code = `error.client.property.${ property }.is.required`;
      error.details = { options: clientOptions };
      micro.die(error);
      return true;
    }
    
    return false;
  });
  
  return clientSetter(micro, clientOptions);
};