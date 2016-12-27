'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports.default = run;

var _defer = require('./../utils/defer');

var _defer2 = _interopRequireDefault(_defer);

var _dateIsoString = require('./../utils/date-iso-string');

var _dateIsoString2 = _interopRequireDefault(_dateIsoString);

var _runInitSubscribers = require('./../utils/run-init-subscribers');

var _runInitSubscribers2 = _interopRequireDefault(_runInitSubscribers);

var _runAddSubscribers = require('./../utils/run-add-subscribers');

var _runAddSubscribers2 = _interopRequireDefault(_runAddSubscribers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

    var _ref = app.settings.listen || {},
        _ref$transport = _ref.transport;

    const transport = _ref$transport === undefined ? 'http' : _ref$transport,
          otherSettings = (0, _objectWithoutProperties3.default)(_ref, ['transport']);


    if (runDeferred) {
      return runDeferred.promise;
    }

    runDeferred = (0, _defer2.default)(cb);

    // Проверяем наличие транспорта для сервера
    if (useServer && typeof transport[transport] !== 'function') {
      // если не найден транспорт - добавим в плагины транспорт по умолчанию
      app.use(app.defaultTransportPlugin((0, _extends3.default)({}, otherSettings)));
    }

    // Запустим всех подписчиков на этап инициализации
    (0, _runInitSubscribers2.default)(app)
    // Запустим всех подписчиков на этап регисрации действий
    .then(() => (0, _runAddSubscribers2.default)(app))
    // Запустим прослушку транспорта для сервера
    .then(() => {
      if (!useServer) {
        return _promise2.default.resolve();
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