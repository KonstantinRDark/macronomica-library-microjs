'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = run;

var _defer = require('./../utils/defer');

var _defer2 = _interopRequireDefault(_defer);

var _nodeHttp = require('./../plugins/node-http');

var _nodeHttp2 = _interopRequireDefault(_nodeHttp);

var _runInitSubscribers = require('./../utils/run-init-subscribers');

var _runInitSubscribers2 = _interopRequireDefault(_runInitSubscribers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * @param {app} app                                 // Экземпляр библиотеки
 * @returns {function:Promise}
 */
function run(app) {
  // Ссылка на обещание запуска
  var runDeferred = void 0;
  /**
   * @namespace app.run
   * @param {function} [cb]
   * @returns {Promise<app>}
   */
  return function (cb) {
    var useServer = !!app.settings;

    var _ref = app.settings || {},
        _ref$transport = _ref.transport,
        transport = _ref$transport === undefined ? 'http' : _ref$transport,
        otherSettings = _objectWithoutProperties(_ref, ['transport']);

    if (runDeferred) {
      return runDeferred.promise;
    }

    runDeferred = (0, _defer2.default)(cb);
    var promise = Promise.resolve();

    if (useServer) {
      promise = promise
      // Проверяем наличие транспорта для сервера
      .then(function () {
        return app.act({ transport: transport });
      })
      // если не найден транспорт - добавим в плагины транспорт по умолчанию
      .catch(function () {
        return app.use((0, _nodeHttp2.default)(otherSettings));
      });
    }

    promise
    // Запустим всех подписчиков на этап инициализации
    .then(function () {
      return (0, _runInitSubscribers2.default)(app);
    })
    // Запустим прослушку транспорта для сервера
    .then(function () {
      return useServer ? app.act({ transport: transport, cmd: 'listen' }) : Promise.resolve();
    }).then(function () {
      return runDeferred.resolve(app);
    }).catch(runDeferred.reject);

    return runDeferred.promise;
  };
}
//# sourceMappingURL=run.js.map