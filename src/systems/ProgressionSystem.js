import { progressionConfig } from '../config/progressionConfig.js';
export class ProgressionSystem {
  constructor(scene){ this.scene=scene; this.level=1; this.xp=0; this.next=progressionConfig.xpForLevel(1); }
  addXP(v){ this.xp+=v; while(this.xp>=this.next&&this.level<50){ this.xp-=this.next; this.level++; this.next=progressionConfig.xpForLevel(this.level); this.applyLevel(); } }
  applyLevel(){ const p=this.scene.player; const g=progressionConfig.statGains; p.stats.hp+=g.hp; p.stats.attack+=g.attack; p.stats.energy+=g.energy; p.stats.defense+=g.defense; p.stats.crit+=g.crit; p.hp=p.stats.hp; p.energy=p.stats.energy; }
}
