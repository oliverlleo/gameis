import { EnemyTank } from './EnemyTank.js';
export class BossA extends EnemyTank {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.type = 'boss_colossus';
    this.maxHp = 2200;
    this.hp = 2200;
    this.damage = 24;
    this.speed = 70;
    this.sprite.width = 78;
    this.sprite.height = 96;
    this.sprite.setFillStyle(0xffaa33);
  }
}
