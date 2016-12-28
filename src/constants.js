import isNumber from 'lodash.isnumber';

const {
  DEF_TIMEOUT:defTimeout = 5000,
  ACT_TIMEOUT:actTimeout = 5000,
  END_TIMEOUT:endTimeout = 5000
} = process.env;

const DEF_TIMEOUT = isNumber(defTimeout) ? defTimeout : 5000;

export const ACT_TIMEOUT = isNumber(+actTimeout) && !isNaN(+actTimeout) ? actTimeout : DEF_TIMEOUT;
export const END_TIMEOUT = isNumber(+endTimeout) && !isNaN(+endTimeout) ? endTimeout : DEF_TIMEOUT;

export const STATE_START = 'start';
export const STATE_RUN = 'run';

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
