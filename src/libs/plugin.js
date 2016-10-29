import {PLUGIN_LOGGER_NAME} from './../constants';
import ProxyLogger from './../utils/proxy-logger';
import provideCall from './../utils/provide-call';

// Регистрирует плагин
export default (micro, options = {}) => {
  const { name, plugin } = options;

  if (name !== PLUGIN_LOGGER_NAME) {
    const errors = [ 'name' ];

    errors.some(property => {
      if (!options[ property ]) {
        const error = new TypeError(`Для добавления плагина свойство "${ property }" обязательно`);
        error.code = `error.plugin.property.${ property }.is.required`;
        error.details = { options };
        micro.die(error);
        return true;
      }

      return false;
    });
  }

  return !plugin
    ? pluginGetter(micro, name)
    : pluginSetter(micro, name, plugin);
};

function pluginGetter(store, name) {
  return (store.plugins[ name ] || {}).plugin;
}

function pluginSetter(micro, name, plugin) {
  const pluginId = micro.genid();

  if (micro.plugin(PLUGIN_LOGGER_NAME)) {
    micro.plugin(PLUGIN_LOGGER_NAME).info(`Регистрация плагина "${ name }"`, { id: pluginId });
  }

  plugin = provideCall([ micro, name, pluginId ], plugin);

  if (name === PLUGIN_LOGGER_NAME) {
    plugin = ProxyLogger(plugin);
  }

  micro.plugins[ name ] = {
    id  : pluginId,
    name: pluginId,
    plugin
  };

  return micro;
}