import fetch from './methods/fetch'

export default function ApiFetchPlugin({ name, ...settings } = {}) {
  return (app, { onClose }) => {
    const apiPin = `api:${ name }`;
    const executeApi = fetch(app, { name, ...settings });

    app.add(apiPin, executeApi);

    onClose(() => app.del(apiPin));

    return Promise.resolve();
  };
}