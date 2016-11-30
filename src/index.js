import Microjs from './app';
import WinstonLogPlugin from './plugins/log-winston';
import genid from './utils/genid';
import defer from './utils/defer';
import iterate from './utils/iterate';

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
  WinstonLogPlugin,
  iterate,
  defer,
  genid
}
export default settings => new Microjs(settings);