import Patrun from 'patrun';

import defer from './utils/defer';

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
 * @param {object} listenSettings
 * @returns {app}
 */
export default function factoryMethod(listenSettings) {
  /**
   * @namespace app
   */
  const app = {
    /**
     * @type {string}
     */
    state      : STATE_INIT,
    /**
     * @type {object}
     */
    manager    : Patrun({ gex: true }),
    /**
     * Список подписчиков
     * @type {{ run: Array<function>, end: Array<function> }}
     */
    subscribers: {
      run: [],      // подписчики для этапа запуска работы
      end: []       // подписчики для этапа завершения работы
    }
  };

  Object.assign(app, {
    log: log(app),
    use: use(app),
    add: add(app),
    del: del(app),
    api: api(app),
    act: act(app),
    end: end(app),
    run: run(app, listenSettings),
  });

  return app;
}