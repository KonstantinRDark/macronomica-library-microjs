'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = run;

var _defer = require('./../utils/defer');

var _defer2 = _interopRequireDefault(_defer);

var _dateIsoString = require('./../utils/date-iso-string');

var _dateIsoString2 = _interopRequireDefault(_dateIsoString);

var _nodeHttp = require('./../plugins/node-http');

var _nodeHttp2 = _interopRequireDefault(_nodeHttp);

var _runInitSubscribers = require('./../utils/run-init-subscribers');

var _runInitSubscribers2 = _interopRequireDefault(_runInitSubscribers);

var _runAddSubscribers = require('./../utils/run-add-subscribers');

var _runAddSubscribers2 = _interopRequireDefault(_runAddSubscribers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * @param {app} app                                 // Экземпляр библиотеки
 * @returns {function:Promise}
 */
function run(app) {
  // Ссылка на обещание запуска
  let runDeferred;
  let transports = {
    http: null
  };

  app.on('plugin.transport', (type, listen) => transports[type] = listen);

  /**
   * @namespace app.run
   * @param {function} [cb]
   * @returns {Promise<app>}
   */
  return cb => {
    const useServer = !!app.settings.listen;

    var _ref = app.settings || {},
        _ref$transport = _ref.transport;

    const transport = _ref$transport === undefined ? 'http' : _ref$transport,
          otherSettings = _objectWithoutProperties(_ref, ['transport']);

    if (runDeferred) {
      return runDeferred.promise;
    }

    runDeferred = (0, _defer2.default)(cb);

    // Проверяем наличие транспорта для сервера
    if (useServer && typeof transport[transport] !== 'function') {
      // если не найден транспорт - добавим в плагины транспорт по умолчанию
      app.use((0, _nodeHttp2.default)(_extends({}, otherSettings)));
    }

    // Запустим всех подписчиков на этап инициализации
    (0, _runInitSubscribers2.default)(app)
    // Запустим всех подписчиков на этап регисрации действий
    .then(() => (0, _runAddSubscribers2.default)(app))
    // Запустим прослушку транспорта для сервера
    .then(() => {
      if (!useServer) {
        return Promise.resolve();
      }

      return transports[transport]();
    }).then(() => {
      app.emit('running', app);
      runDeferred.resolve(app);
    }).catch(runDeferred.reject);

    return runDeferred.promise;
  };
}
//# sourceMappingURL=run.js.map