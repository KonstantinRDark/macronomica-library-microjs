import genid from './../../utils/genid';
import listenHttp from './methods/listen';
const TRANSPORT = 'http';

export default function NodeHttpPlugin({ ...settings }) {
  return (microjs, { onClose, manager }) => {
    const plugin = { id: genid() };
    const getTransportPin = `transport:${ TRANSPORT }`;
    const getTransportListenPin = `transport:${ TRANSPORT }, cmd:listen`;

    microjs.add(getTransportPin, function getHttpTransportRoute() { return plugin });
    microjs.add(getTransportListenPin, listenHttp(microjs, plugin, onClose, settings));

    onClose(() => microjs
      .del(getTransportPin)
      .del(getTransportListenPin)
    )
  };
}