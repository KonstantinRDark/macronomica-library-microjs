import clientExec from './client-exec';
import genid from './../../utils/genid';
import {TRANSPORT_SUPPORTS} from './constants';

/**
 * 1) Регистрируем клиента
 * 2) Создаем транспорт для общения с клиентом
 * 2) Создаем транспорт для общения с клиентом
 */
export default function clientSetter(micro, transportOptions) {
  const { name, type } = transportOptions;
  const pluginTransport = micro.plugin(type);

  if (!pluginTransport) {
    const error = new Error([
      `Транспорт клиента "${ type }" не поддерживается`,
      `Поддерживаемые типы транспортов: [ "${ TRANSPORT_SUPPORTS.join('", "') }" ]`
    ].join('. '));
    error.code = `error.client.setter/type.not.available`;
    error.details = { options: transportOptions };
    return micro.die(error);
  }

  const clientId = genid();
  const transport = pluginTransport.client(transportOptions);
  const client = {
    id: clientId,
    name,
    transport,
  };
  const api = {
    exec: clientExec(micro, client)
  };

  micro.clients[ name ] = { ...client, api };

  micro.logger.info(`Регистрация клиента "${ name }"`, { id: clientId, payload: { transportOptions } });

  return micro;
}