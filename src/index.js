import Microjs from './app';
import WinstonLogPlugin from './plugins/log-winston';

import {
  LEVEL_ALL,
  LEVEL_OFF,
  LEVEL_INFO,
  LEVEL_TRACE,
  LEVEL_DEBUG,
  LEVEL_WARN,
  LEVEL_ERROR,
  LEVEL_FATAL,
  LEVEL_DEFAULT,
} from './constants';

export {
  LEVEL_ALL,
  LEVEL_OFF,
  LEVEL_INFO,
  LEVEL_TRACE,
  LEVEL_DEBUG,
  LEVEL_WARN,
  LEVEL_ERROR,
  LEVEL_FATAL,
  LEVEL_DEFAULT,
  WinstonLogPlugin
}
export default settings => new Microjs(settings);