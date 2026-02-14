import { EnemyBase } from './EnemyBase.js';
export class BossB extends EnemyBase {
  constructor(scene, x, y) {
    super(scene, x, y, { type: 'boss_seraph', role: 'ranged', hp: 1800, damage: 22, speed: 95, attackRange: 280, color: 0xaaccff });
    this.sprite.width = 70;
    this.sprite.height = 90;
  }
}
