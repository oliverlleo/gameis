import EnemyBase from './EnemyBase.js';

export default class EnemyTank extends EnemyBase {
  constructor(scene, x, y, def) {
    super(scene, x, y, { ...def, classKey: 'tank', mass: 2.4, attackCdMs: 1120 }, 'enemy_tank');
    this.groupRole = 'frontline';
  }
}
