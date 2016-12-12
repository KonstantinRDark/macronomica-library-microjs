import http from 'http';
import buffer from 'buffer';
import qs from 'qs';
import bodyParser from 'body-parser';
import url from 'url';
import iterate from './../../../utils/iterate';
import genid from './../../../utils/genid';
import updateDuration from './../../../utils/update-duration';
import {
  SERVER_PREFIX,
  SERVER_HOST,
  SERVER_PORT,
  RESPONSE_PROPERTY_STATUS,
  RESPONSE_PROPERTY_RESULT,
  RESPONSE_STATUS_SUCCESS,
  RESPONSE_STATUS_ERROR
} from './../constants';

const jsonBodyParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const type = 'http';

const preprocessors = [
  jsonBodyParser,
  urlencodedParser
];

export default function listenHttp(app, plugin, onClose, settings = {}) {
  return function listenHttpRoute() {
    const server = http.createServer(handleRequest);
    const { host = SERVER_HOST, port = SERVER_PORT } = settings;

    app.log.debug('Настройки HTTP сервера', { plugin: { host, port } });
    server.on('error', app.log.error);
    server.on('connection', (socket) => {
      socket.setNoDelay(); // Отключаем алгоритм Нагла.
    });

    onClose(() => new Promise((resolve, reject) => {
      server.close((err) => {
        if (err && err.message !== 'Not running') {
          return reject(err);
        }
        app.log.trace('Остановлен Node Http сервер', { plugin: { host, port } });
        resolve();
      });
    }), 'unshift');

    return new Promise((resolve, reject) => {
      server.listen(port, host, (err) => {
        if (err) {
          return reject(err);
        }
        app.log.trace('Запущен Node Http сервер', { plugin: { host, port } });
        resolve();
      });
    });

    function handleRequest(req, res, next){
      req._originalUrl = req.url;
      req.url = url.parse(req.url);
      req.query = qs.parse(req.url.query);

      if (req.url.pathname !== SERVER_PREFIX) {
        app.log.info(`[404:${ req.method }:error.transport.http.listen/url.not.found]`);
        return response404(res, 'error.transport.http.listen/url.not.found');
      }

      iterate(req.method === 'POST' ? preprocessors : [], req, res, (err) => {
        if (err) {
          app.log.error(err);
          app.log.info(`[404:${ req.method }:error.transport.http.listen/preprocessors.parse]`);
          return response404(res, 'error.transport.http.listen/preprocessors.parse');
        }
        const request = {
          id: genid(),
          time: {
            hrtime: process.hrtime(),
            start : Date.now()
          }
        };
        const transport = {
          type,
          origin: req.headers[ 'user-agent' ],
          time  : Date.now()
        };
        const pin = {
          ...(req.body || {}),
          ...req.query
        };

        if (pin.role === 'plugin') {
          app.log.warn(`Вызов приватного метода`, { pin, transport });
          app.log.info(`[404:${ req.method }:error.transport.http.listen/call.private.method]`);
          return response404(res, {});
        }

        app.act({ ...pin, request, transport }, (error, result) => {
          const code = error ? 500 : 200;
          const status = error ? RESPONSE_STATUS_ERROR : RESPONSE_STATUS_SUCCESS;

          const outJson = JSON.stringify({
            [ RESPONSE_PROPERTY_STATUS ]: status,
            [ RESPONSE_PROPERTY_RESULT ]: error || result
          });


          res.writeHead(code, {
            'Content-Type'  : 'application/json',
            // 'Cache-Control' : 'private, max-age=0, no-cache, no-store',
            'Content-Length': buffer.Buffer.byteLength(outJson)
          });

          updateDuration(request);
          app.log.info(`[${ code }:${ req.method }:${ status }] ${ request.time.duration }`, { pin });

          res.end(outJson);
        });
      });
    }
  };
}

function response404(res, result) {
  const json = JSON.stringify({
    [ RESPONSE_PROPERTY_STATUS ]: RESPONSE_STATUS_ERROR,
    [ RESPONSE_PROPERTY_RESULT ]: result
  });

  res.writeHead(404, {
    'Content-Type'  : 'application/json',
    'Cache-Control' : 'private, max-age=0, no-cache, no-store',
    'Content-Length': buffer.Buffer.byteLength(json)
  });

  res.statusMessage = 'Not found';
}