import {ACTION_ERR} from './constants';

export default function clientGetter(micro, name) {
  const client = micro.clients[ name ];
  
  if (!client) {
    const msg = {
      actionId: '---------',
      action  : ACTION_ERR,
      error   : {
        code   : 'error.client.getter/client.not.found',
        message: `Клиент с именем "${ name }" не зарегистирован`
      }
    };

    micro.logger.error(msg.error.message, msg);
    
    return { exec: () => {} };
  }
  
  return client.api;
}