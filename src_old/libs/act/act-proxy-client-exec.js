import isString from 'lodash.isstring';

export default function actProxyClientExec(micro, request) {
  return {
    ...micro,
    client: (name) => {
      let api = micro.client(name);

      if (isString(name)) {
        api = new Proxy(api, {
          get(target, property) {
            const _original = target[ property ];
            return (...args) => _original(...args, { request });
          }
        });
      }

      return api;
    }
  };
}