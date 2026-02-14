export class DirectorSystem {
  constructor(scene) { this.scene = scene; this.intensity = 0; }
  update(dt) {
    this.intensity = Phaser.Math.Clamp(this.intensity + dt * 0.00002, 0, 1);
    if (Math.sin(this.scene.time.now / 5000) > 0.85) this.scene.systemsBag.spawn.next += 400;
  }
}
