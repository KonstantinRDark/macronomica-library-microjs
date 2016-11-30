import EventEmitter from 'events';
import Patrun from 'patrun';

import log from './methods/log';
import use from './methods/use';
import add from './methods/add';
import del from './methods/del';
import act from './methods/act';
import api from './methods/api';
import end from './methods/end';
import run from './methods/run';

// Статус блокирует
const STATE_INIT = 'init';
const STATE_WAIT = 'wait';
const STATE_RUN = 'run';
const STATE_END = 'run';

/**
 * @namespace app
 */
export default class Microjs extends EventEmitter {
  /**
   * @namespace app.state
   * @type {string}
   */
  state = STATE_INIT;
  /**
   * @namespace app.manager
   * @type {object}
   */
  manager = Patrun({ gex: true });
  /**
   * Список подписчиков
   * @namespace app.subscribers
   * @type {{ run: Array<function>, end: Array<function> }}
   */
  subscribers = {
    run: [],      // подписчики для этапа запуска работы
    end: []       // подписчики для этапа завершения работы
  };

  constructor(settings) {
    super();
    this.settings = settings;
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