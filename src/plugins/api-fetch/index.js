import fetch from './methods/fetch'

export default function ApiFetchPlugin({ name, ...settings } = {}) {
  return (microjs, { onClose }) => {
    const apiPin = `api:${ name }`;
    const executeApi = fetch(microjs, { name, ...settings });

    microjs.add(apiPin, executeApi);

    onClose(() => microjs.del(apiPin));

    return Promise.resolve();
  };
}