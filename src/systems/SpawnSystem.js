import { spawnConfig } from '../config/spawnConfig.js';
import { ENEMY_TYPES } from '../core/Constants.js';

export class SpawnSystem {
  constructor(scene) { this.scene = scene; this.next = 0; }
  init() {}
  update() {
    if (this.scene.time.now < this.next) return;
    this.next = this.scene.time.now + 1400;
    const p = this.scene.player.sprite;
    const x = p.x + 800 + Math.random() * 300;
    const y = 580;
    if (Phaser.Math.Distance.Between(x, y, p.x, p.y) < spawnConfig.minSpawnDist) return;
    this.scene.events.emit('spawnEnemy', { x, y, type: Phaser.Utils.Array.GetRandom(ENEMY_TYPES) });
  }
}
