import ApiFetchPlugin from './../plugins/api-fetch';

/**
 * @param {app} app
 * @returns {function}
 */
export default app => {
  /**
   * @namespace app.api
   * @param {string} name
   * @param {object} [settings]
   * @returns {app}
   */
  return (name, settings = {}) => app.use(ApiFetchPlugin({ name, ...settings }));
};