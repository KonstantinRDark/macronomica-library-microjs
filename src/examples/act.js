import Micro from './../';
import WinstonLogPlugin from './../plugins/log-winston';

const micro = Micro()
  .use(WinstonLogPlugin());

micro
  .run()
  .then(() => micro.act('cmd:ping'))
  .then(result => micro.log.info(`ping - ${ result }`))
  .catch(micro.log.error)
;
