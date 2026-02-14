export class CollisionSystem {
  constructor(scene){ this.scene=scene; }
  init(){
    this.scene.physics.add.collider(this.scene.player, this.scene.platforms);
    this.scene.physics.add.collider(this.scene.enemies, this.scene.platforms);
    this.scene.physics.add.overlap(this.scene.player, this.scene.loot, (_, orb)=>{ this.scene.systemsMap.economy.addGold(5); orb.destroy(); });
    this.scene.physics.add.overlap(this.scene.player, this.scene.enemies, (p, e)=> p.takeDamage(10 + (e.type==='tank'?5:0)));
  }
}
