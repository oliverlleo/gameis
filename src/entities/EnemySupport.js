import EnemyBase from './EnemyBase.js';

export default class EnemySupport extends EnemyBase {
  constructor(scene, x, y, def) {
    super(scene, x, y, { ...def, classKey: 'support', attackCdMs: 1550 }, 'enemy_support');
    this.groupRole = 'backline';
  }
}
