import { EnemyBase } from './EnemyBase.js';
export class EnemyAssassin extends EnemyBase {
  constructor(scene, x, y) {
    super(scene, x, y, { type: 'stabber', role: 'assassin', hp: 58, damage: 16, speed: 145, attackRange: 56, color: 0xf447a9 });
  }
}
