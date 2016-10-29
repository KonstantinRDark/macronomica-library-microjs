import {round} from './polyfills/mdn-decimal-adjust';

export default function updateDuration(request) {
  const [ seconds, nanoseconds ] = process.hrtime(request.time.hrtime);
  request.time.end = Date.now();
  request.time.duration = round((seconds * 1000) + (nanoseconds * 1e-6), -3) + ' ms';
}