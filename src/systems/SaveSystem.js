export class SaveSystem {
  constructor(scene){ this.scene=scene; this.key='shard_runner_save'; this.version=2; }
  init(){
    const raw=localStorage.getItem(this.key); if(!raw) return;
    try{ const data=JSON.parse(raw); if(data.version!==this.version) return; this.scene.systemsMap.economy.gold=data.gold||0; } catch { localStorage.removeItem(this.key); }
    window.addEventListener('beforeunload',()=>this.persist());
  }
  persist(){ localStorage.setItem(this.key, JSON.stringify({version:this.version,gold:this.scene.systemsMap.economy.gold,seed:133742})); }
}
