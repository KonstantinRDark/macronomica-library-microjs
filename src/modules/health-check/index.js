export default function HealthCheckModule(settings = {}) {
  return (app, { onClose }) => {
    const pingPin = 'cmd:ping';
    app.add(pingPin, function ping() { return 'pong' });
    onClose(() => app.del(pingPin));
  };
}