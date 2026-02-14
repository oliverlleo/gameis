import { aiConfig } from '../config/aiConfig.js';
export class AISystem {
  constructor(scene){ this.scene=scene; }
  update(){
    const p=this.scene.player;
    this.scene.enemies.children.each((e)=>{
      if(!e.active) return;
      const dist = p.x-e.x;
      if (Math.abs(dist) < aiConfig.detectDistance) { e.state='chase'; e.setVelocityX(Math.sign(dist)*e.speed); }
      if (Math.abs(dist) < 50 && performance.now()-e.lastAttackAt > 1000) { e.lastAttackAt = performance.now(); p.takeDamage(8); }
      if (Math.abs(dist) > aiConfig.leashDistance) e.setVelocityX(0);
    });
  }
}
