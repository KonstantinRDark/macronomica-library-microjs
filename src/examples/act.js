import Micro from './../';

const micro = Micro();

micro
  .run()
  .then(() => micro.act('cmd:ping'))
  .then(micro.log.info)
  .catch(micro.log.error)
;
