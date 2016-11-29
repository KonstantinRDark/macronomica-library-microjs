
/**
 * @param {object} microjs                // Экземпляр библиотеки
 * @param {function[]} initSubscribers    // Список подписчиков на этап инициализации
 * @returns {function(?function):object}
 */
export default function use(microjs, initSubscribers) {
  return cb => {
    initSubscribers.push(cb);
    return microjs;
  };
}