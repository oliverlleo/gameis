import { combatConfig } from '../config/combatConfig.js';
export class SkillSystem {
  constructor(scene){ this.scene=scene; }
  update(){
    const p=this.scene.player; const k=this.scene.systemsMap.input.keys; if(!k) return;
    [['s1','ascendingRupture'],['s2','shadowStep'],['s3','flowBlade'],['s4','freezingPrism'],['s5','overloadCore']].forEach(([key,skill])=>{
      if (Phaser.Input.Keyboard.JustDown(k[key])) this.cast(skill);
    });
  }
  cast(skill){
    const data=combatConfig.skillData[skill]; const p=this.scene.player; const now=performance.now();
    if (p.energy < data.cost || (p.cooldowns[skill]||0)>now) return;
    p.energy -= data.cost; p.cooldowns[skill]=now+data.cooldown;
    if (skill==='shadowStep') { p.x += p.facing*140; p.invulnUntil = now+220; return; }
    this.scene.enemies.children.each((e)=>{
      if (!e.active) return;
      const dist=Phaser.Math.Distance.Between(p.x,p.y,e.x,e.y);
      if (dist< (skill==='overloadCore'?220:160)) e.takeDamage(data.damage + p.stats.attack*0.7);
    });
  }
}
