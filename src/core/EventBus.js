const emitter = new Phaser.Events.EventEmitter();

export const EventBus = {
  on: (event, fn, ctx) => emitter.on(event, fn, ctx),
  once: (event, fn, ctx) => emitter.once(event, fn, ctx),
  off: (event, fn, ctx) => emitter.off(event, fn, ctx),
  emit: (event, ...args) => emitter.emit(event, ...args),
  clear: () => emitter.removeAllListeners()
};
