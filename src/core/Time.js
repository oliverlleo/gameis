export class Time {
  constructor() { this.scale = 1; }
  hitstop(scene, ms) { scene.physics.world.timeScale = 0.0001; scene.time.delayedCall(ms, () => { scene.physics.world.timeScale = 1; }); }
}
