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

export default function factoryMethod(listenSettings) {
  const runDeferred = defer();
  const endDeferred = defer();
  const promises = {
    run: runDeferred.promise,
    end: endDeferred.promise
  };
  const subscribers = { run: [], end: [] };
  const manager = Patrun({ gex: true });
  const microjs = {};

  Object.assign(microjs, {
    log: log(microjs),
    use: use(microjs, { promises, subscribers }),
    add: add(microjs, { manager }),
    del: del(microjs, { manager }),
    api: api(microjs),
    act: act(microjs, { manager, promises }),
    end: end(microjs, { subscribers, promises }),
    run: run(microjs, { subscribers, promises }, listenSettings),
  });

  return microjs;
}