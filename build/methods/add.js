'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash.isstring');

var _lodash2 = _interopRequireDefault(_lodash);

var _jsonic = require('jsonic');

var _jsonic2 = _interopRequireDefault(_jsonic);

var _genid = require('./../utils/genid');

var _genid2 = _interopRequireDefault(_genid);

var _constants = require('./../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {app} app
 * @returns {function}
 */
exports.default = app => {
  /**
   * @namespace app.add
   * @param {string|object} pin
   * @param {function} cb
   * @returns {app}
   */
  return (pin, cb) => {
    if (app.state === _constants.STATE_RUN) {
      return __add();
    }

    app.subscribers.add.push(__add);
    app.subscribers.end.push(() => app.del(pin));

    return app;

    function __add() {
      const action = {
        id: (0, _genid2.default)(),
        name: cb.name
      };

      app.log.trace(`Добавление нового маршрута`, { pin, action });

      app.manager.add((0, _lodash2.default)(pin) ? (0, _jsonic2.default)(pin) : pin, { pin, action, callback: cb });

      return app;
    }
  };
};
//# sourceMappingURL=add.js.map