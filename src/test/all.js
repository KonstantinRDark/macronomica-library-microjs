import Micro from './../';

const micro = Micro()
  .add('cmd:ping', () => {
    console.log('pong');
    return 'pong';
  });

micro
  .run(() => {
    micro.act('cmd:ping').then(result => console.log(result));
  });
