
/**
 * @param {app} app
 * @returns {function}
 */
export default app => {
  /**
   * @namespace app.use
   * @param {function} ?cb
   * @returns {app}
   */
  return cb => {
    app.subscribers.run.push(cb);
    return app;
  };
};