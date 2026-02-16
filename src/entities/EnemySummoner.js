import EnemyBase from './EnemyBase.js';

export default class EnemySummoner extends EnemyBase {
  constructor(scene, x, y, def) {
    super(scene, x, y, { ...def, classKey: 'summoner', attackCdMs: 2100 }, 'enemy_summoner');
    this.groupRole = 'backline';
  }
}
