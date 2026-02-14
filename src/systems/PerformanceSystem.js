export class PerformanceSystem {
  constructor(scene) { this.scene = scene; this.tick = 0; }
  init() {}
  update(dt) {
    this.tick += dt;
    if (this.tick < 500) return;
    this.tick = 0;
    this.scene.enemies.children.iterate(e => { if (e && e.x < this.scene.player.sprite.x - 1400) e.destroy(); });
  }
}
