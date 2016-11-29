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
 * @param {object} microjs                          // Экземпляр библиотеки
 * @param {{ run: [], end: [] }} subscribers        // Список подписчиков
 * @param {{ run: promise, end: promise }} promises // Список ожиданий
 * @param {object} settings                         // Настройки для запуска сервера
 * @returns {function(?function):Promise}
 */
function run(microjs, _ref, settings) {
  var subscribers = _ref.subscribers,
      promises = _ref.promises;

  var useServer = !!settings;

  var _ref2 = settings || {},
      _ref2$transport = _ref2.transport,
      transport = _ref2$transport === undefined ? 'http' : _ref2$transport,
      otherSettings = _objectWithoutProperties(_ref2, ['transport']);

  // Ссылка на обещание запуска


  var runDeferred = void 0;

  return function (cb) {
    if (runDeferred) {
      return runDeferred.promise;
    }

    runDeferred = (0, _defer2.default)(cb);
    var promise = Promise.resolve();

    if (useServer) {
      promise = promise
      // Проверяем наличие транспорта для сервера
      .then(function () {
        return microjs.act({ transport: transport });
      })
      // если не найден транспорт - добавим в плагины транспорт по умолчанию
      .catch(function () {
        return microjs.use((0, _nodeHttp2.default)(otherSettings));
      });
    }

    promise
    // Запустим всех подписчиков на этап инициализации
    .then(function () {
      return (0, _runInitSubscribers2.default)(microjs, subscribers.run, subscribers.end);
    })
    // Запустим прослушку транспорта для сервера
    .then(function () {
      return useServer ? microjs.act({ transport: transport, cmd: 'listen' }) : Promise.resolve();
    }).then(function () {
      return runDeferred.resolve(microjs);
    }).catch(runDeferred.reject);

    return runDeferred.promise;
  };
}
//# sourceMappingURL=run.js.map