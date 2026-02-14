export class DirectorSystem {
  constructor(scene){ this.scene=scene; this.intensity=0; }
  update(dt){
    this.intensity = Phaser.Math.Clamp(this.intensity + (this.scene.enemies.countActive(true)>8?0.45:-0.35)*dt,0,1);
    this.scene.spawnBudget = this.intensity<0.35 ? 1.2 : this.intensity<0.75 ? 0.8 : 0.4;
  }
}
