import { LootOrb } from '../entities/LootOrb.js';
export class LootSystem { constructor(scene){ this.scene=scene; }
  spawnLoot(x,y){ if (Math.random()<0.75) this.scene.loot.add(new LootOrb(this.scene,x,y-10)); }
}
