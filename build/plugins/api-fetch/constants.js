'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const API_TIMEOUT = exports.API_TIMEOUT = process.env.API_TIMEOUT || 5000;
const CLIENT_SECRET = exports.CLIENT_SECRET = process.env.INTERNAL_SECRET || 'sdvlm40294gmsovMW4HGNBAsvdv4vvw4';
const CLIENT_TRANSPORT_HEADER = exports.CLIENT_TRANSPORT_HEADER = 'x-microjs-transport';
const CLIENT_REQUEST_HEADER = exports.CLIENT_REQUEST_HEADER = 'x-microjs-request';
const CLIENT_CONTENT_TYPE = exports.CLIENT_CONTENT_TYPE = 'application/json';
const CLIENT_PREFIX = exports.CLIENT_PREFIX = '/act';

const RESPONSE_PROPERTY_STATUS = exports.RESPONSE_PROPERTY_STATUS = 'status';
const RESPONSE_PROPERTY_RESULT = exports.RESPONSE_PROPERTY_RESULT = 'result';
const RESPONSE_STATUS_SUCCESS = exports.RESPONSE_STATUS_SUCCESS = 'success';
const RESPONSE_STATUS_ERROR = exports.RESPONSE_STATUS_ERROR = 'error';

const SSH_KEY_PATH = exports.SSH_KEY_PATH = `${ process.env.HOME }/.ssh/id_rsa`;
const SSH_HOST = exports.SSH_HOST = '178.63.99.6';
const SSH_PORT = exports.SSH_PORT = 2225;
//# sourceMappingURL=constants.js.map