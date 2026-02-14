export class PerformanceSystem { constructor(scene){ this.scene=scene; } update(){
  this.scene.enemies.children.each((e)=>{ if(e.active && e.x < this.scene.player.x-1800) e.destroy(); });
  this.scene.loot.children.each((l)=>{ if(l.active && l.x < this.scene.player.x-1200) l.destroy(); });
} }
