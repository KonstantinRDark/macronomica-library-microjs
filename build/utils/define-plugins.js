"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (micro, plugins) {
  Object.keys(plugins).forEach(function (name) {
    return micro.plugin(name, plugins[name]);
  });
};
//# sourceMappingURL=define-plugins.js.map