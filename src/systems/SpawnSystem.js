import { EnemyMelee } from '../entities/EnemyMelee.js';
import { EnemyRanged } from '../entities/EnemyRanged.js';
import { EnemyTank } from '../entities/EnemyTank.js';
import { EnemySupport } from '../entities/EnemySupport.js';
import { EnemySummoner } from '../entities/EnemySummoner.js';
import { EnemyAssassin } from '../entities/EnemyAssassin.js';
export class SpawnSystem {
  constructor(scene){ this.scene=scene; this.timer=0; this.types=[EnemyMelee,EnemyRanged,EnemyTank,EnemySupport,EnemySummoner,EnemyAssassin,EnemyMelee,EnemyRanged,EnemyTank,EnemyAssassin]; }
  update(dt){
    this.timer -= dt;
    if (this.timer>0) return;
    this.timer = 0.8 / (this.scene.spawnBudget||1);
    if (this.scene.enemies.countActive(true) > 25) return;
    const C=this.types[Phaser.Math.Between(0,this.types.length-1)];
    const x=this.scene.player.x + Phaser.Math.Between(560, 1100); const y=420;
    if (Math.abs(x-this.scene.player.x)<450) return;
    this.scene.enemies.add(new C(this.scene,x,y));
  }
}
