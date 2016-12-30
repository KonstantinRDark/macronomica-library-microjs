import isString from 'lodash.isstring';
import jsonic from 'jsonic';
import { version } from '../../package.json';
import genid from './genid';
import { round } from './mdn-decimal-adjust';

export {
  clear
};

export default (app, raw) => {
  if (isString(raw)) {
    raw = jsonic(raw);
  }

  const TRANSPORT = {
    type  : 'inner',
    trace : [],
    origin: `microjs-${ app.name !== 'microjs' ? app.name : '' }-v${ version }`
  };

  const { transport = TRANSPORT, request, ...msg } = clearOldRequest(raw);
  const req = newReq(app);

  Object.assign(req, {
    ...msg,
    transport,
    duration,
    request: wrapRequest(request),
    act    : (pin) => {
      if (isString(pin)) { pin = jsonic(pin) }
      const { request, transport } = req;
      return app.act({ ...pin, request, transport });
    }
  });

  return req;

  function duration() {
    const [ seconds, nanoseconds ] = process.hrtime(req.request.time.hrtime);
    req.request.time.end = Date.now();
    return req.request.time.duration = round((seconds * 1000) + (nanoseconds * 1e-6), -3);
  }
};

function wrapRequest({
  original:parent,
  owner:oId,
  trace = []
} = {}) {
  const original = genid();
  const owner = oId || original;
  const start = Date.now();
  const hrtime = process.hrtime();
  const id = [
    owner + (original !== owner || !!parent ? ':~:' : ''),
    !!parent ? parent + '~>~' : '',
    original !== owner ? original : ''
  ].join('');

  trace = !!parent ? [ ...trace, original ] : [];

  return {
    id,
    time: { hrtime, start },
    original,
    parent,
    owner,
    trace
  };
}

function newReq(app) {
  return {
    get appId() { return app.id },

    get appName() { return app.name },

    get log() { return app.log },
  };
}

function clearOldRequest({ appId, appName, log, duration, act, ...msg }) {
  return msg;
}

function clear({ appId, appName, log, duration, act, transport, request, ...msg } = {}) {
  return msg;
}