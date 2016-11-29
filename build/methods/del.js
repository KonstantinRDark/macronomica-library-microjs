"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = del;
function del(microjs, _ref) {
  var manager = _ref.manager;

  return function (pin) {
    var route = manager.find(pin);

    if (!route) {
      microjs.log.trace("\u0423\u0434\u0430\u043B\u0435\u043D\u0438\u0435 \u043D\u0435\u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u044E\u0449\u0435\u0433\u043E \u043C\u0430\u0440\u0448\u0440\u0443\u0442\u0430", pin);
      return microjs;
    }

    var action = route.action;


    microjs.log.info("\u0423\u0434\u0430\u043B\u0435\u043D\u0438\u0435 \u043C\u0430\u0440\u0448\u0440\u0443\u0442\u0430", action);

    manager.remove(pin);

    return microjs;
  };
}
//# sourceMappingURL=del.js.map