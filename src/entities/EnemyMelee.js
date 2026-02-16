import EnemyBase from './EnemyBase.js';

export default class EnemyMelee extends EnemyBase {
  constructor(scene, x, y, def) {
    super(scene, x, y, { ...def, classKey: 'melee', attackCdMs: 820 }, 'enemy_melee');
    this.groupRole = 'frontline';
  }
}
