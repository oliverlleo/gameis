import { combatConfig } from '../config/combatConfig.js';
export class CombatSystem {
  constructor(scene){ this.scene=scene; }
  update(){
    const p=this.scene.player; const keys=this.scene.systemsMap.input.keys; if(!keys) return;
    if (Phaser.Input.Keyboard.JustDown(keys.light)) this.attack(false);
    if (Phaser.Input.Keyboard.JustDown(keys.heavy)) this.attack(true);
    p.comboTimer = Math.max(0, p.comboTimer-1);
    if (p.comboTimer===0) p.comboStep=0;
  }
  attack(isHeavy){
    const p=this.scene.player;
    const atk = isHeavy ? combatConfig.combo[3] : combatConfig.combo[Math.min(2,p.comboStep)];
    if (!isHeavy) p.comboStep=(p.comboStep+1)%3;
    p.comboTimer = 28;
    const range = isHeavy?90:64;
    this.scene.enemies.children.each((e)=>{
      if (!e.active) return;
      if (Math.abs(e.x-p.x)<range && Math.abs(e.y-p.y)<50 && Math.sign(e.x-p.x)===p.facing) {
        const crit = Math.random() < (p.stats.crit || 0.08);
        const dmg = (atk.damage+p.stats.attack) * (crit?combatConfig.critMultiplier:1);
        e.takeDamage(dmg);
        e.setVelocityX(p.facing*(isHeavy?180:120)/(e.mass||1));
      }
    });
  }
}
