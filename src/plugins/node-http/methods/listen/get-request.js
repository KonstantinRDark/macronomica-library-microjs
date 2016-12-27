import jwt from 'jsonwebtoken';
import makeRequest from './../../../../utils/make-request';

import {
  SERVER_SECRET,
  SERVER_TRANSPORT_HEADER,
  SERVER_REQUEST_HEADER,
} from './../../constants';

const type = 'http';

export default function getRequest(app, req, pin) {
  const request = makeRequest(app, {
    transport: getTransport(app, req),
    ...pin
  });

  if (SERVER_REQUEST_HEADER in req.headers) {
    request.request = {
      ...request.request,
      ...jwt.verify(req.headers[ SERVER_REQUEST_HEADER ], SERVER_SECRET).request
    };
  }

  return request;
}

function getTransport(app, req) {
  const transport = {
    type,
    origin: req.headers[ 'user-agent' ],
    method: req.method,
    time  : Date.now()
  };

  if (SERVER_TRANSPORT_HEADER in req.headers) {
    let transportInHeader = jwt.verify(req.headers[ SERVER_TRANSPORT_HEADER ], SERVER_SECRET);
    Object.assign(transport, transportInHeader.transport);
  }

  transport.trace = [
    ...(transport.trace || []),
    app.name
  ];

  return transport;
}