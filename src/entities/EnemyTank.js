import { EnemyBase } from './EnemyBase.js';
export class EnemyTank extends EnemyBase {
  constructor(scene, x, y) {
    super(scene, x, y, { type: 'brute', role: 'tank', hp: 160, damage: 18, speed: 55, attackRange: 75, color: 0xa04444 });
  }
}
