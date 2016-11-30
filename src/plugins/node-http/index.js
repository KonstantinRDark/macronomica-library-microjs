import genid from './../../utils/genid';
import listenHttp from './methods/listen';
const TRANSPORT = 'http';

export default function NodeHttpPlugin({ ...settings } = {}) {
  return (app, { onClose }) => {
    const plugin = { id: genid() };
    app.emit('plugin.transport', TRANSPORT, listenHttp(app, plugin, onClose, settings));
  };
}