import genid from './genid';

export default ({ id, actionId } = {}) => ({
  id  : id || genid(),
  actionId,
  time: {
    hrtime: process.hrtime(),
    start : Date.now()
  }
});