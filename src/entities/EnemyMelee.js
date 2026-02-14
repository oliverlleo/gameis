import { EnemyBase } from './EnemyBase.js';
export class EnemyMelee extends EnemyBase {
  constructor(scene, x, y, variant='raider') {
    super(scene, x, y, { type: variant, role: 'melee', hp: 78, damage: 12, speed: 105, attackRange: 68, color: 0xdf5a5a });
  }
}
