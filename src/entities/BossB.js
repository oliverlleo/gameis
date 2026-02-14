import { EnemyBase } from './EnemyBase.js';
export class BossB extends EnemyBase {
  constructor(s,x,y){ super(s,x,y,'bossB'); this.hp=5600; this.maxHp=5600; this.phase=1; this.speed=95; this.setScale(2.2); }
  updatePhase(){ const ratio=this.hp/this.maxHp; this.phase = ratio<0.35?3:ratio<0.7?2:1; }
}
