import { gameConfig } from '../config/gameConfig.js';
import { RNG } from '../core/RNG.js';
import { biomeConfig } from '../config/biomeConfig.js';
export class ProceduralChunkSystem {
  constructor(scene){ this.scene=scene; this.rng = new RNG(gameConfig.startSeed); this.chunks=new Map(); }
  init(){ for(let i=-1;i<3;i++) this.ensureChunk(i); }
  update(){
    const cx = Math.floor(this.scene.player.x / gameConfig.chunkWidth);
    for(let i=cx-gameConfig.keepChunksBehind;i<=cx+gameConfig.keepChunksAhead;i++) this.ensureChunk(i);
    for(const key of [...this.chunks.keys()]) if (key < cx-gameConfig.keepChunksBehind || key > cx+gameConfig.keepChunksAhead) this.unloadChunk(key);
  }
  ensureChunk(i){
    if (this.chunks.has(i)) return;
    const biome = biomeConfig[Math.abs(i)%biomeConfig.length];
    const plats=[]; const baseX=i*gameConfig.chunkWidth;
    for(let p=0;p<14;p++){
      const x=baseX+p*140+this.rng.int(-20,20); const y=500-this.rng.int(0,120);
      const s=this.scene.platforms.create(x,y,'platform').setOrigin(0,0).refreshBody(); s.biome=biome.name; plats.push(s);
    }
    this.chunks.set(i, plats);
  }
  unloadChunk(i){ this.chunks.get(i)?.forEach((p)=>p.destroy()); this.chunks.delete(i); }
}
