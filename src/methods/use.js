
/**
 * @param {object} microjs                // Экземпляр библиотеки
 * @param {function[]} runSubscribers     // Список подписчиков на этап инициализации
 * @returns {function(?function):object}
 */
export default function use(microjs, { subscribers:{ run:runSubscribers } }) {
  return cb => {
    runSubscribers.push(cb);
    return microjs;
  };
}