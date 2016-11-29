export default function del(microjs, manager) {
  return (pin) => {
    const route = manager.find(pin);

    if (!route) {
      microjs.log.trace(`Удаление несуществующего маршрута`, pin);
      return microjs;
    }

    const { action } = route;

    microjs.log.info(`Удаление маршрута`, action);

    manager.remove(pin);

    return microjs;
  };
}