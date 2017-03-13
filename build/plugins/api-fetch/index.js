'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = ApiFetchPlugin;

var _deepmerge = require('deepmerge');

var _deepmerge2 = _interopRequireDefault(_deepmerge);

var _lodash = require('lodash.isplainobject');

var _lodash2 = _interopRequireDefault(_lodash);

var _fetch = require('./methods/fetch');

var _fetch2 = _interopRequireDefault(_fetch);

var _parseSettings = require('./utils/parse-settings');

var _parseSettings2 = _interopRequireDefault(_parseSettings);

var _getClientConfig = require('./utils/get-client-config');

var _getClientConfig2 = _interopRequireDefault(_getClientConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const clientsSettings = {};

function ApiFetchPlugin(app) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  let name = _ref.name;
  var _ref$settings = _ref.settings;
  let settings = _ref$settings === undefined ? {} : _ref$settings;

  clientsSettings[app.id] = clientsSettings[app.id] || {};
  clientsSettings[app.id][name] = (0, _parseSettings2.default)(app, name, (0, _deepmerge2.default)((0, _getClientConfig2.default)(app, name), settings));

  return (app, _ref2) => {
    let onClose = _ref2.onClose;


    app.add({ role: 'plugin', cmd: 'clients' }, () => _promise2.default.resolve((0, _keys2.default)(clientsSettings[app.id])));

    let settings = { name, settings: clientsSettings[app.id][name] };

    app.log.info(`microjs.common.api-add.${name}`, settings);
    app.add(`api:${name}`, (0, _fetch2.default)(app, settings));

    onClose(() => {
      if ((0, _lodash2.default)(clientsSettings[app.id][name])) {
        delete clientsSettings[app.id][name];
      }
    });
  };
}
//# sourceMappingURL=index.js.map