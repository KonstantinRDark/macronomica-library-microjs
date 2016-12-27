import setLevelAction from './actions/set-level';

export default function HealthCheckModule(settings = {}) {
  return (app, { onClose }) => {
    app.add({ cmd: 'ping' }, function ping() { return 'pong' });
    app.add({ cmd: 'level' }, setLevelAction);
  };
}