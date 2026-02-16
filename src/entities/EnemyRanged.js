import EnemyBase from './EnemyBase.js';

export default class EnemyRanged extends EnemyBase {
  constructor(scene, x, y, def) {
    super(scene, x, y, { ...def, classKey: 'ranged', attackCdMs: 1280 }, 'enemy_ranged');
    this.groupRole = 'backline';
  }
}
