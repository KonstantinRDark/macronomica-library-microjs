'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const SERVER_SECRET = exports.SERVER_SECRET = process.env.INTERNAL_SECRET || 'sdvlm40294gmsovMW4HGNBAsvdv4vvw4';
const SERVER_TRANSPORT_HEADER = exports.SERVER_TRANSPORT_HEADER = 'x-microjs-transport';
const SERVER_REQUEST_HEADER = exports.SERVER_REQUEST_HEADER = 'x-microjs-request';
const SERVER_PREFIX = exports.SERVER_PREFIX = '/act';
const SERVER_ENCODING = exports.SERVER_ENCODING = 'utf8';
const SERVER_HOST = exports.SERVER_HOST = '0.0.0.0';
const SERVER_PORT = exports.SERVER_PORT = 8000;

const CLIENT_PREFIX = exports.CLIENT_PREFIX = SERVER_PREFIX;

const RESPONSE_PROPERTY_STATUS = exports.RESPONSE_PROPERTY_STATUS = 'status';
const RESPONSE_PROPERTY_RESULT = exports.RESPONSE_PROPERTY_RESULT = 'result';
const RESPONSE_STATUS_SUCCESS = exports.RESPONSE_STATUS_SUCCESS = 'success';
const RESPONSE_STATUS_ERROR = exports.RESPONSE_STATUS_ERROR = 'error';
//# sourceMappingURL=constants.js.map