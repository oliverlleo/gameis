import { EnemyBase } from './EnemyBase.js';
export class EnemySupport extends EnemyBase {
  constructor(scene, x, y) {
    super(scene, x, y, { type: 'hexer', role: 'support', hp: 72, damage: 8, speed: 78, attackRange: 200, color: 0x9f6bff });
  }
  update(dt, player) {
    super.update(dt, player);
    if (this.scene.time.now % 2100 < 16) {
      this.scene.enemies.children.each((obj) => {
        const entity = obj?.getData('entity');
        if (entity && entity !== this && Phaser.Math.Distance.Between(obj.x, obj.y, this.sprite.x, this.sprite.y) < 180) {
          entity.hp = Math.min(entity.maxHp, entity.hp + 3);
        }
      });
    }
  }
}
