import ApiFetchPlugin from './../plugins/api-fetch';

export default function api(microjs) {
  return (name, settings = {}) => microjs.use(ApiFetchPlugin({ name, ...settings }));
}