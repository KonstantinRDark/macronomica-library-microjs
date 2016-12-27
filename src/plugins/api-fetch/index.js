import fetch from './methods/fetch'
import parseSettings from './utils/parse-settings'

export default function ApiFetchPlugin(app, { name, settings } = {}) {
  settings = parseSettings(app, settings);

  return (app, { onClose }) => {
    const apiPin = `api:${ name }`;

    app.add(apiPin, fetch(app, { name, settings }));

    return Promise.resolve();
  };
}