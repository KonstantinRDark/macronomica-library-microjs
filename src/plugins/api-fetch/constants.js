export const API_TIMEOUT = process.env.API_TIMEOUT || 5000;
export const CLIENT_SECRET = process.env.INTERNAL_SECRET || 'sdvlm40294gmsovMW4HGNBAsvdv4vvw4';
export const CLIENT_TRANSPORT_HEADER = 'x-microjs-transport';
export const CLIENT_REQUEST_HEADER = 'x-microjs-request';
export const CLIENT_CONTENT_TYPE = 'application/json';
export const CLIENT_PREFIX = '/act';

export const RESPONSE_PROPERTY_STATUS = 'status';
export const RESPONSE_PROPERTY_RESULT = 'result';
export const RESPONSE_STATUS_SUCCESS = 'success';
export const RESPONSE_STATUS_ERROR = 'error';

export const SSH_KEY_PATH = `${ process.env.HOME }/.ssh/id_rsa`;
export const SSH_HOST = '178.63.99.6';
export const SSH_PORT = 2225;