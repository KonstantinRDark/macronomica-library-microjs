'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constants = require('./../constants');

var _proxyLogger = require('./../utils/proxy-logger');

var _proxyLogger2 = _interopRequireDefault(_proxyLogger);

var _provideCall = require('./../utils/provide-call');

var _provideCall2 = _interopRequireDefault(_provideCall);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Регистрирует плагин
exports.default = function (micro) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var name = options.name,
      plugin = options.plugin;


  if (name !== _constants.PLUGIN_LOGGER_NAME) {
    var errors = ['name'];

    errors.some(function (property) {
      if (!options[property]) {
        var error = new TypeError('\u0414\u043B\u044F \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u043F\u043B\u0430\u0433\u0438\u043D\u0430 \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u043E "' + property + '" \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E');
        error.code = 'error.plugin.property.' + property + '.is.required';
        error.details = { options: options };
        micro.die(error);
        return true;
      }

      return false;
    });
  }

  return !plugin ? pluginGetter(micro, name) : pluginSetter(micro, name, plugin);
};

function pluginGetter(store, name) {
  return (store.plugins[name] || {}).plugin;
}

function pluginSetter(micro, name, plugin) {
  var pluginId = micro.genid();

  if (micro.plugin(_constants.PLUGIN_LOGGER_NAME)) {
    micro.plugin(_constants.PLUGIN_LOGGER_NAME).info('\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F \u043F\u043B\u0430\u0433\u0438\u043D\u0430 "' + name + '"', { id: pluginId });
  }

  plugin = (0, _provideCall2.default)([micro, name, pluginId], plugin);

  if (name === _constants.PLUGIN_LOGGER_NAME) {
    plugin = (0, _proxyLogger2.default)(plugin);
  }

  micro.plugins[name] = {
    id: pluginId,
    name: pluginId,
    plugin: plugin
  };

  return micro;
}
//# sourceMappingURL=plugin.js.map
