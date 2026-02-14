import { EnemyBase } from './EnemyBase.js';
export class EnemyMelee extends EnemyBase { constructor(s,x,y){ super(s,x,y,'melee'); this.speed=90; this.hp=80; this.maxHp=80; } }
