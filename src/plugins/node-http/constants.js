export const SERVER_SECRET = process.env.INTERNAL_SECRET || 'sdvlm40294gmsovMW4HGNBAsvdv4vvw4';
export const SERVER_TRANSPORT_HEADER = 'x-microjs-transport';
export const SERVER_REQUEST_HEADER = 'x-microjs-request';
export const SERVER_PREFIX = '/act';
export const SERVER_ENCODING = 'utf8';
export const SERVER_HOST = '0.0.0.0';
export const SERVER_PORT = 8000;

export const CLIENT_PREFIX = SERVER_PREFIX;

export const RESPONSE_PROPERTY_STATUS = 'status';
export const RESPONSE_PROPERTY_RESULT = 'result';
export const RESPONSE_STATUS_SUCCESS = 'success';
export const RESPONSE_STATUS_ERROR = 'error';