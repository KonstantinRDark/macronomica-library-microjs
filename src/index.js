import Events from 'events';
import Util from 'util';
import patrun from 'patrun';
import {
  APP_STATE_INITIALIZATION,
  APP_STATE_INSTALLING,
  APP_STATE_RUNNING,
  APP_STATE_STOPPED,
  PLUGIN_TRANSPORT_NAME_HTTP,
  PLUGIN_LOGGER_NAME
} from './constants';
import genid from './utils/genid';
import definePlugins from './utils/define-plugins';
import dateIsoString from './utils/date-iso-string';
import cliSeparator from './utils/cli-separator';
import Queue from './utils/queue';
import handleAct from './libs/act';
import handleAdd from './libs/add';
import handlePlugin from './libs/plugin';
import handleClient from './libs/client';
import handleListen from './libs/listen';
import defaultLogger from './plugins/logger';
import defaultTransportHttp from './plugins/transport/http';

export class Micro extends Events.EventEmitter {
  id = genid();

  lifecicle = {
    started: false,
    inited : false,
    running: false,
    closed : false
  };

  time = {
    started: undefined
  };

  plugins = {};
  actions = {};
  clients = {};

  __queue = {
    wait : [],
    init : [],
    close: []
  };

  actionManager = undefined;

  genid = genid;

  constructor({
    plugins: {
      [ PLUGIN_LOGGER_NAME ]:logger,
      [ PLUGIN_TRANSPORT_NAME_HTTP ]:httpTransport,
      ...plugins
    } = {}
  } = {}) {
    super();
    const started = this.time.started = Date.now();
    process.on('exit', this.close);
    process.on('uncaughtException', this.die);

    definePlugins(this, {
      [ PLUGIN_LOGGER_NAME ]: logger || defaultLogger()
    });

    this.logger.info([
      cliSeparator(),
      '# Micro started',
      cliSeparator({ sub: true }),
      '# Instance  : ' + this.id,
      `# When      : ${ dateIsoString(started) }`,
      cliSeparator(),
      `# Status    : ${ APP_STATE_INITIALIZATION }`,
      cliSeparator(),
    ].join('\n'));

    this.actionManager = patrun({ gex:true });

    if (plugins) {
      definePlugins(this, {
        ...plugins,
        [ PLUGIN_TRANSPORT_NAME_HTTP ]: httpTransport || defaultTransportHttp()
      })
    }

    process.nextTick(this.__init);
  }

  __init = () => {
    if (this.closed()) {
      return;
    }

    if (this.__queue.wait.length) {
      this.logger.info([ cliSeparator(), `# STATUS : ${ APP_STATE_INSTALLING }`, cliSeparator() ].join('\n'));
    }

    this.lifecicle.inited = true;

    (function loop(micro) {
      const next = () => setImmediate(() => loop(micro));

      if (micro.__queue.wait.length) {
        return micro.__queue.wait = (new Queue({ jobs: micro.__queue.wait })).start(next);
      }

      if (!micro.lifecicle.running) {
        micro.logger.info([ cliSeparator(), `# STATUS : ${ APP_STATE_RUNNING }`, cliSeparator() ].join('\n'));
        micro.emit('ready', micro);
      }

      micro.lifecicle.running = true;

      if (micro.__queue.init.length) {
        return micro.__queue.init = (new Queue({ jobs: micro.__queue.init })).start(next);
      }
    })(this);
  };

  queue = (job) => {
    let cb;
    let queue;

    switch (job.case) {
      case 'act':
      case 'client':
        cb = job.callback;
        queue = this.__queue.init;
        break;
      case 'wait':
      case 'close':
        cb = (done) => job.done(...job.args).then(done, this.die);
        queue = this.__queue[ job.case ];
        break;
    }

    if (!this.lifecicle.inited) {
      !!cb && queue.push(cb);
    } else {
      return !!cb && cb(() => { });
    }

    return this;
  };

  closed = () => {
    return this.lifecicle.closed;
  };

  close = (code) => {
    const inst = this;

    if (inst.lifecicle.closed) {
      return;
    }

    if (!inst.lifecicle.running) {
      return setImmediate(() => inst.close(code));
    }

    inst.lifecicle.closed = true;

    if (inst.__queue.close.length) {
      inst.logger.info([ cliSeparator(), `# Status    : ${ APP_STATE_STOPPED }`, cliSeparator() ].join('\n'));
      return (new Queue({ jobs: inst.__queue.close })).start(done);
    } else {
      done();
    }

    function done() {
      inst.logger.info([
        cliSeparator(),
        `# Micro ${ APP_STATE_STOPPED }`,
        cliSeparator({ sub: true }),
        '# Instance  : ' + inst.id,
        `# When      : ${ dateIsoString(Date.now()) }`,
        `# Code      : ${ code }`,
        cliSeparator()
      ].join('\n'));

      process.exit(code);
    }
  };

  die = (error) => {
    const micro = this;

    let stack = error.stack || '';
    stack = stack
      .replace(/^.*?\n/, '\n')
      .replace(/\n/g, '\n          ')
    ;

    micro.logger.error([
      '##############################################################################################',
      `# Fatal Error`,
      '# Instance  : ' + micro.id,
      '# =========================================================================================== ',
      '  Message   : ' + error.message,
      '  Code      : ' + error.code,
      '  Details   : ' + Util.inspect(error.details, {depth: null}),
      '  When      : ' + (new Date()).toISOString(),
      '  Stack     : ' + stack,
      '  Node      : ' + Util.inspect(process.versions).replace(/\s+/g, ' '),
      '              ' + Util.inspect(process.features).replace(/\s+/g, ' '),
      '              ' + Util.inspect(process.moduleLoadList).replace(/\s+/g, ' '),
      '  Process   : ',
      '              pid=' + process.pid,
      '              arch=' + process.arch,
      '              platform=' + process.platform,
      '              path=' + process.execPath,
      '              argv=' + Util.inspect(process.argv).replace(/\n/g, ''),
      '              env=' + Util.inspect(process.env).replace(/\n/g, ''),
      '##############################################################################################'
    ].join('\n'));
  };

  act = (pin, callback) => {
    return handleAct(this, pin, callback);
  };

  add = (pin, callback) => {
    return handleAdd(this, pin, callback);
  };

  client = (clientOptions) => {
    return handleClient(this, clientOptions);
  };

  listen = (transportOptions) => {
    return handleListen(this, transportOptions);
  };

  plugin = (name, plugin) => {
    return handlePlugin(this, { name, plugin })
  };

  ready = (callback) => {
    this.setMaxListeners(this.getMaxListeners() + 1);
    let emited = false;

    const unbind = this.once('ready', () => {
      emited = true;
      callback(this);
      this.setMaxListeners(Math.max(this.getMaxListeners() - 1, 0));
    });

    this.queue({
      case: 'close',
      args: [ unbind ],
      done: (unbind) => {
        if (!emited) unbind();
      }
    });

    return unbind;
  };

  get logger() {
    return this.plugin(PLUGIN_LOGGER_NAME)
  };

  get api() {
    const micro = this;

    return {
      ready : micro.ready,
      act   : micro.act,
      add   : micro.add,
      close : micro.close,
      logger: micro.logger,
      plugin: micro.plugin,
      client: micro.client,
      listen: micro.listen
    }
  }
}

export default (options = {}) => {
  const micro = new Micro(options);
  return micro.api
};