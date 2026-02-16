export default class Time {
  constructor() {
    this.last = performance.now();
    this.deltaMs = 16.67;
    this.deltaSec = 0.01667;
  }

  tick(now = performance.now()) {
    this.deltaMs = Math.max(0.001, now - this.last);
    this.deltaSec = this.deltaMs / 1000;
    this.last = now;
  }
}
