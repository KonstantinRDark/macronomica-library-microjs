"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = use;

/**
 * @param {object} microjs                // Экземпляр библиотеки
 * @param {function[]} initSubscribers    // Список подписчиков на этап инициализации
 * @returns {function(?function):object}
 */
function use(microjs, initSubscribers) {
  return function (cb) {
    initSubscribers.push(cb);
    return microjs;
  };
}
//# sourceMappingURL=use.js.map