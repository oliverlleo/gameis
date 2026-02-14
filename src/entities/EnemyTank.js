import { EnemyBase } from './EnemyBase.js';
export class EnemyTank extends EnemyBase { constructor(s,x,y){ super(s,x,y,'tank'); this.speed=45; this.hp=150; this.maxHp=150; this.mass=2.2; } }
