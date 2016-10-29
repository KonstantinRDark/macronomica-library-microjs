import Queue3 from 'queue3';

export default class Queue extends Queue3 {
  __next = undefined;
  waiting = true;

  constructor({ jobs = [], ...options } = {}) {
    super(options);
    jobs.forEach(job => this.push(job));
  }

  start(next = () => {}) {
    this.__next = next;
    this.waiting = false;
    return this;
  }

  run() {
    if (!this.jobs.length && this.__next) {
      return this.__next();
    }

    if (!this.waiting) {
      super.run();
    }
  };
}