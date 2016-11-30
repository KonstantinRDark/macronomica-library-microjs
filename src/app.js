import EventEmitter from 'events';
import Patrun from 'patrun';

import genid from './utils/genid';
import dateIsoString from './utils/date-iso-string';

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

  constructor(settings = {}) {
    super();
    const { id, level = this.log.level, maxListeners = EventEmitter.defaultMaxListeners } = settings;

    if (!!id) {
      this.id = id;
    }

    this.settings = settings;
    this.log.level = level;
    this.setMaxListeners(maxListeners);

    this
      .use(HealthCheckModule())
      .on('running', app => {
        app.state = STATE_RUN;
        app.time.running = Date.now();
        app.log.info([
          '============================ app-running ===========================',
          '# Instance Id: ' + app.id,
          `# Started At : ${ dateIsoString(app.time.started) }`,
          `# Running At : ${ dateIsoString(app.time.running) }`,
          '========================== app-running-end =========================',
        ]);
      });

    this.log.info(`started at ${ dateIsoString(this.time.started) }`);
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