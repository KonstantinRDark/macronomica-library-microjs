import isPlainObject from 'lodash.isplainobject';

export default (plugin) => new Proxy(plugin, {
  get(target, property) {
    const _original = target[ property ];

    return (...rest) => {
      let meta = rest[ rest.length - 1];

      if (isPlainObject(meta)) {
        Object.assign(meta, {
          when : Date.now(),
          level: property
        });
      }
      return _original(...rest);
    };
  }
});