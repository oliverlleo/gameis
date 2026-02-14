export class ValidationSystem {
  constructor(scene) { this.scene = scene; this.results = { spawnSafe: true, cleanup: true, jumpBuffer: true }; }
  init() {}
  update() {
    const p = this.scene.player.sprite;
    this.scene.enemies.children.iterate((e) => {
      if (!e) return;
      const dist = Phaser.Math.Distance.Between(e.x, e.y, p.x, p.y);
      if (dist < 60) this.results.spawnSafe = false;
      if (e.x < p.x - 1800) this.results.cleanup = false;
    });
  }
}
