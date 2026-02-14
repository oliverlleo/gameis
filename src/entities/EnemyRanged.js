import { EnemyBase } from './EnemyBase.js';
export class EnemyRanged extends EnemyBase { constructor(s,x,y){ super(s,x,y,'ranged'); this.speed=70; this.hp=60; this.maxHp=60; } }
