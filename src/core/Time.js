export const Time = {
  toFrames(ms) { return Math.round(ms / (1000 / 60)); },
  now: () => performance.now(),
};
