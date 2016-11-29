import Patrun from 'patrun';

import log from './methods/log';
import use from './methods/use';
import add from './methods/add';
import del from './methods/del';
import act from './methods/act';
import api from './methods/api';
import end from './methods/end';
import run from './methods/run';

export default function factoryMethod(listenSettings) {
  const initSubscribers = [];
  const closeSubscribers = [];

  const microjs = {};
  const manager = Patrun({ gex: true });

  Object.assign(microjs, {
    log: log(microjs),
    use: use(microjs, initSubscribers),
    add: add(microjs, manager),
    del: del(microjs, manager),
    api: api(microjs),
    act: act(microjs, manager),
    end: end(microjs, closeSubscribers),
    run: run(microjs, initSubscribers, closeSubscribers, listenSettings),
  });

  return microjs;
}