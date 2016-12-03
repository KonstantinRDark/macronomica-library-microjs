import Microjs from './app';
import WinstonLogPlugin from './plugins/log-winston';
import genid from './utils/genid';
import defer from './utils/defer';
import iterate from './utils/iterate';
import {
  error,
  internalError,
  propertyIsRequiredError,
  propertyMustBeTypeError,
  propertyMustBeNotEmptyError,
  ERROR_SEPARATOR,
  
  ERROR_INTERNAL_ERROR,
  ERROR_PROPERTY_IS_REQUIRED,
  
  ERROR_PROPERTY_MUST_BE,
  ERROR_PROPERTY_MUST_BE_NOT_EMPTY_ARRAY
} from './errors';

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
  genid,
  
  error,
  internalError,
  propertyIsRequiredError,
  propertyMustBeTypeError,
  propertyMustBeNotEmptyError,
  ERROR_SEPARATOR,
  
  ERROR_INTERNAL_ERROR,
  ERROR_PROPERTY_IS_REQUIRED,
  
  ERROR_PROPERTY_MUST_BE,
  ERROR_PROPERTY_MUST_BE_NOT_EMPTY_ARRAY
}
export default settings => new Microjs(settings);