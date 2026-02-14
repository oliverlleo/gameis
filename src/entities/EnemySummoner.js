import { EnemyBase } from './EnemyBase.js';
export class EnemySummoner extends EnemyBase {
  constructor(scene, x, y) {
    super(scene, x, y, { type: 'caller', role: 'summoner', hp: 80, damage: 9, speed: 70, attackRange: 180, color: 0x6c6cff });
    this.summonCd = 0;
  }
  update(dt, player) {
    super.update(dt, player);
    this.summonCd -= dt;
    if (this.summonCd <= 0 && Math.abs(this.sprite.x - player.x) < 360) {
      this.summonCd = 5500;
      this.scene.events.emit('spawnEnemy', { x: this.sprite.x + Phaser.Math.Between(-90, 90), y: this.sprite.y, type: 'lurker' });
    }
  }
}
