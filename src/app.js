import EventEmitter from 'events';
import Patrun from 'patrun';

import genid from './utils/genid';
import dateIsoString from './utils/date-iso-string';

import WinstonLogPlugin from './plugins/log-winston';
import NodeHttpPlugin from './plugins/node-http';

import HealthCheckModule from './modules/health-check';

import log from './methods/log';
import use from './methods/use';
import add from './methods/add';
import del from './methods/del';
import act from './methods/act';
import api from './methods/api';
import end from './methods/end';
import run from './methods/run';

import { STATE_START, STATE_RUN } from './constants';

/**
 * @namespace app
 * @class Microjs
 * @augments EventEmitter
 */
export default class Microjs extends EventEmitter {
  /**
   * @namespace app
   * @memberof app.on
   */
  /**
   * @namespace app
   * @memberof app.emit
   */

  /**
   * @namespace app.id
   * @type {string}
   */
  id = genid();

  /**
   * @namespace app.state
   * @type {string}
   */
  state = STATE_START;

  /**
   * @namespace app.manager
   * @type {object}
   */
  manager = Patrun({ gex: true });

  /**
   * Плагин транспорта по умолчанию
   * @namespace app.defaultTransportPlugin
   * @type {function}
   */
  defaultTransportPlugin = NodeHttpPlugin;

  /**
   * Плагин логгера по умолчанию
   * @namespace app.defaultLogPlugin
   * @type {function}
   */
  defaultLogPlugin = WinstonLogPlugin;

  /**
   * Список модулей для инициализации
   * @namespace app.modules
   * @type {Array<function>}
   */
  modules = [
    HealthCheckModule()
  ];

  /**
   * Список подписчиков
   * @namespace app.subscribers
   * @type {{ run: Array<function>, add: Array<function>, end: Array<function> }}
   */
  subscribers = {
    run: [],      // подписчики для этапа запуска работы
    add: [],      // подписчики для этапа регистрации действий
    end: []       // подписчики для этапа завершения работы
  };

  /**
   * Метрики времени
   * @namespace app.time
   * @type {{ started: number, running: ?number }}
   */
  time = {
    started: Date.now(),
    running: null
  };

  /**
   * @this app
   * @param settings
   */
  constructor(settings = {}) {
    super();
    initialize(this, settings);
    this.on('running', onRunning);
    process.on('SIGINT', this.end);
  }

  log = log(this);
  use = use(this);
  add = add(this);
  del = del(this);
  api = api(this);
  act = act(this);
  end = end(this);
  run = run(this);
}

/**
 * @param {app} app
 * @param {object} settings
 */
function initialize(app, settings) {
  const {
    id = app.id,
    level = app.log.level,
    plugins = [],
    modules = app.modules,
    maxListeners = EventEmitter.defaultMaxListeners
  } = settings;

  app.log.level = level;
  app.setMaxListeners(maxListeners);

  Object.assign(app, { id, settings });

  app.use(app.defaultLogPlugin({ level }));

  if (Array.isArray(plugins)) {
    plugins.forEach(plugin => app.use(plugin));
  }

  if (Array.isArray(modules)) {
    modules.forEach(module => app.use(module));
  }
}

function onRunning(app) {
  app.state = STATE_RUN;
  app.time.running = Date.now();
  app.log.info([
    '============================ app-running ===========================',
    '# Instance Id: ' + app.id,
    `# Started At : ${ dateIsoString(app.time.started) }`,
    `# Running At : ${ dateIsoString(app.time.running) }`,
    '========================== app-running-end =========================',
  ]);
}