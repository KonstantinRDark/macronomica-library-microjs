import isString from 'lodash.isstring';
import jsonic from 'jsonic';
import { version } from '../../package.json';
import genid from './genid';
import { round } from './mdn-decimal-adjust';

const TRANSPORT = {
  type  : 'inner',
  trace : [],
  origin: `microjs-origin-v${ version }`
};

export {
  clear
};

export default (app, raw) => {
  if (isString(raw)) {
    raw = jsonic(raw);
  }
  
  const {
    // Убираем гетеры если есть
    appId, appName, log,
    
    transport = TRANSPORT,
    request = {},
    ...msg
  } = raw;
  
  const req = {
    get appId() { return app.id },
  
    get appName() { return app.name },
  
    get log() { return app.log },
  };

  return Object.assign(req, {
    transport,
    request: {
      id  : genid(),
      ...request,
      time: {
        hrtime: process.hrtime(),
        start : Date.now()
      }
    },
    ...msg,
    updateDuration,
    act: (...rest) => app.act(...rest)
  });
  
  function updateDuration() {
    const [ seconds, nanoseconds ] = process.hrtime(req.request.time.hrtime);
    req.request.time.end = Date.now();
    req.request.time.duration = round((seconds * 1000) + (nanoseconds * 1e-6), -3) + 'ms';
    return req;
  }
};

function clear({ appId, appName, log, updateDuration, act, transport, request, ...msg } = {}) {
  return msg;
}