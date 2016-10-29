import {TRANSPORT_SUPPORTS} from './client/constants';

// Запускает прослушку транспорта
export default (micro, transportOptions) => {
  const { type } = transportOptions;
  const pluginTransport = micro.plugin(type);

  if (!pluginTransport) {
    const error = new Error([
      `Транспорт "${ type }" не поддерживается`,
      `Поддерживаемые типы транспортов: [ "${ TRANSPORT_SUPPORTS.join('", "') }" ]`
    ].join('. '));
    error.code = `error.listen/type.not.available`;
    error.details = { options: transportOptions };
    return micro.die(error);
  }

  pluginTransport.listen(transportOptions);

  return micro.api;
};