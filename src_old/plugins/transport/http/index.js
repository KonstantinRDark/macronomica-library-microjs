import listen from './listen';
import client from './client';

export default (defaultOptions = {}) => (micro, name, pluginId) => {
  let handleListen;
  let handleClient;
  const plugin = { name, id: pluginId };

  micro
    .queue({
      case: 'wait',
      args: [],
      done: () => !handleListen ? Promise.resolve() : handleListen.listen()
    })
    .queue({
      case: 'close',
      args: [],
      done: () => !handleListen ? Promise.resolve() : handleListen.close()
    });

  return {
    listen: (options = {}) => handleListen = listen(micro, plugin, { ...defaultOptions, ...options }),
    client: (options = {}) => handleClient = client(micro, plugin, { ...defaultOptions, ...options })
  };
};