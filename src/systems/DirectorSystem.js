import { RARE_EVENTS } from '../core/Constants.js';

export class DirectorSystem {
  constructor(scene) {
    this.scene = scene;
    this.intensity = 0;
    this.nextEventAt = 2200;
    this.lastEvent = 'none';
  }

  update(dt) {
    const dist = this.scene.player.sprite.x;
    this.intensity = Phaser.Math.Clamp((dist / 12000) + 0.12 * Math.sin(this.scene.time.now / 4200), 0, 1);

    if (dist > this.nextEventAt) {
      this.lastEvent = Phaser.Utils.Array.GetRandom(RARE_EVENTS);
      this.nextEventAt += Phaser.Math.Between(1500, 2300);
      if (this.lastEvent === 'sanctuary') this.scene.player.hp = Math.min(this.scene.player.maxHp, this.scene.player.hp + 35);
      if (this.lastEvent === 'merchant') this.scene.systemsBag.prog.gold += 20;
    }
  }
}
