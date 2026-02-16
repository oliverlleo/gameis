import EnemyBase from './EnemyBase.js';

export default class EnemyAssassin extends EnemyBase {
  constructor(scene, x, y, def) {
    super(scene, x, y, { ...def, classKey: 'assassin', attackCdMs: 780 }, 'enemy_assassin');
    this.groupRole = 'frontline';
  }
}
