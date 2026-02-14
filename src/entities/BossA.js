import { EnemyBase } from './EnemyBase.js';
export class BossA extends EnemyBase {
  constructor(s,x,y){ super(s,x,y,'bossA'); this.hp=4200; this.maxHp=4200; this.phase=1; this.speed=80; this.setScale(2); }
  updatePhase(){ const ratio=this.hp/this.maxHp; this.phase = ratio<0.35?3:ratio<0.7?2:1; }
}
