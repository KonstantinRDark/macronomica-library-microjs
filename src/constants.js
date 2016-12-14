export const STATE_START = 'start';
export const STATE_RUN = 'run';
export const ACT_TIMEOUT = 5000;
export const END_TIMEOUT = 5000;

export const LEVEL_ALL = 'all';
export const LEVEL_OFF = 'off';
export const LEVEL_INFO = 'info';
export const LEVEL_TRACE = 'trace';
export const LEVEL_DEBUG = 'debug';
export const LEVEL_WARN = 'warn';
export const LEVEL_ERROR = 'error';
export const LEVEL_FATAL = 'fatal';

export const LEVEL_DEFAULT = process.env.NODE_ENV !== 'development'
  ? LEVEL_INFO
  : ('DEBUG' in process.env ? LEVEL_DEBUG : LEVEL_TRACE);
