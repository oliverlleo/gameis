export class ValidationSystem {
  constructor(scene){ this.scene=scene; }
  safeRespawn(){ const p=this.scene.player; p.setPosition(this.scene.player.x-240, 200); p.setVelocity(0,0); p.hp=Math.max(1,p.hp-15); }
}
