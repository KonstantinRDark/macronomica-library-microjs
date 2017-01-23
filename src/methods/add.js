import isString from 'lodash.isstring';
import jsonic from 'jsonic';
import genid from './../utils/genid';
import { STATE_RUN } from './../constants';

/**
 * @param {app} app
 * @returns {function}
 */
export default app => {
  /**
   * @namespace app.add
   * @param {string|object} pin
   * @param {function} cb
   * @returns {app}
   */
  return (pin, cb) => {
    if (app.state === STATE_RUN) {
      return __add();
    }

    app.subscribers.add.push(__add);
    app.subscribers.end.push(() => app.del(pin));

    return app;

    function __add() {
      const action = {
        id  : genid(),
        name: cb.name
      };
      let level = pin.role === 'plugin' || ('private' in pin && pin.private === true) ? 'trace' : 'info';

      app.log[ level ](`microjs.common.add.${ action.name || action.id }`, { pin, action });

      app.manager.add(isString(pin) ? jsonic(pin) : pin, { pin, action, callback: cb });

      return app;
    }
  };
};