import isString from 'lodash.isstring';
import jsonic from 'jsonic';
import makeRequestObject from './make-request-object';

export default (raw) => {
  raw = isString(raw) ? jsonic(raw) : raw;
  const { transport, request, ...params } = raw;
  return {
    params,
    transport,
    request: request || makeRequestObject()
  };
};