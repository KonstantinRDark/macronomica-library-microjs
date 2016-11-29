import http from 'http';
import buffer from 'buffer';
import qs from 'qs';
import bodyParser from 'body-parser';
import url from 'url';
import iterate from './../../../utils/iterate';
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

export default function listenHttp(micro, plugin, onClose, { host = SERVER_HOST, port }) {
  return function listenHttpRoute() {
    if ([ 'localhost', '0.0.0.0', ].includes(port)) {
      port = SERVER_PORT;
    }
    port = port || SERVER_PORT;

    const server = http.createServer(handleRequest);

    server.on('error', micro.log.error);
    server.on('connection', function(socket) {
      socket.setNoDelay(); // Отключаем алгоритм Нагла.
    });

    onClose(() => new Promise((resolve, reject) => {
      server.close((err) => {
        if (err && err.message !== 'Not running') {
          return reject(err);
        }

        resolve();
      });
    }));

    return new Promise((resolve, reject) => {
      server.listen(port, host, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });

    function handleRequest(req, res){
      req._originalUrl = req.url;
      req.url = url.parse(req.url);
      req.query = qs.parse(req.url.query);

      if (req.url.pathname !== SERVER_PREFIX) {
        const error = {
          code   : 'error.transport.http.listen/url.not.found',
          message: 'Не корректный маршрут запроса'
        };

        const outJson = JSON.stringify({
          [ RESPONSE_PROPERTY_STATUS ]: RESPONSE_STATUS_ERROR,
          [ RESPONSE_PROPERTY_RESULT ]: error
        });

        res.writeHead(404, {
          'Content-Type'  : 'application/json',
          'Cache-Control' : 'private, max-age=0, no-cache, no-store',
          'Content-Length': buffer.Buffer.byteLength(outJson)
        });
        res.statusMessage = 'Not found';
        return res.end(outJson);
      }

      iterate(req.method === 'POST' ? preprocessors : [], req, res, (err) => {
        if (err) {
          return micro.logger.error(err);
        }
        const pin = {
          ...(req.body || {}),
          ...req.query,
          transport: {
            type,
            origin: req.headers[ 'user-agent' ],
            time  : Date.now()
          }
        };

        micro.act(pin, (error, result) => {
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

          res.end(outJson);
        });
      });
    }
  };
}

