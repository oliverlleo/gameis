import { EnemyBase } from './EnemyBase.js';
export class EnemyRanged extends EnemyBase {
  constructor(scene, x, y, variant='gunner') {
    super(scene, x, y, { type: variant, role: 'ranged', hp: 64, damage: 11, speed: 82, attackRange: 240, color: 0xff9f5a });
  }
  performAttack(player) {
    const dist = Math.abs(this.sprite.x - player.x);
    if (dist < 140) this.sprite.body.setVelocityX(Math.sign(this.sprite.x - player.x) * this.speed * 1.15);
    if (dist < this.attackRange && Math.abs(this.sprite.y - player.y) < 70) {
      this.scene.player.applyDamage(this.damage, Math.sign(player.x - this.sprite.x) * 55);
    }
  }
}
