"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = use;

/**
 * @param {object} microjs                // Экземпляр библиотеки
 * @param {function[]} runSubscribers     // Список подписчиков на этап инициализации
 * @returns {function(?function):object}
 */
function use(microjs, _ref) {
  var runSubscribers = _ref.subscribers.run;

  return function (cb) {
    runSubscribers.push(cb);
    return microjs;
  };
}
//# sourceMappingURL=use.js.map