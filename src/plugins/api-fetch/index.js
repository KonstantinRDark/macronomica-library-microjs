import deepmerge from 'deepmerge'
import isPlainObject from 'lodash.isplainobject'
import fetch from './methods/fetch'
import parseSettings from './utils/parse-settings'
import getClientConfig from './utils/get-client-config'
const clientsSettings = {};

export default function ApiFetchPlugin(app, { name, settings = {} } = {}) {
  clientsSettings[ app.id ] = clientsSettings[ app.id ] || {};
  clientsSettings[ app.id ][ name ] = parseSettings(
    app, name,
    deepmerge(getClientConfig(app, name), settings)
  );

  return (app, { onClose }) => {

    app.add({ role: 'plugin', cmd: 'clients' }, () =>
      Promise.resolve(Object.keys(clientsSettings[ app.id ])));

    app.add(`api:${ name }`, fetch(app, { name, settings: clientsSettings[ app.id ][ name ] }));

    onClose(() => {
      if (isPlainObject(clientsSettings[ app.id ][ name ])) {
        delete clientsSettings[ app.id ][ name ];
      }
    });
  };
}