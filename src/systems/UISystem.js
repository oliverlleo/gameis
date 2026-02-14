export class UISystem {
  constructor(scene){ this.scene=scene; this.paused=false; }
  init(){
    this.text=this.scene.add.text(14,12,'',{fontSize:'16px',color:'#fff'}).setScrollFactor(0).setDepth(20);
    this.menu=document.getElementById('menu-root');
    this.menu.addEventListener('click',(e)=>{ const a=e.target.dataset.action; if(a==='continue') this.togglePause(); if(a==='restart') location.reload(); });
    document.getElementById('font-size').addEventListener('change',e=>document.documentElement.style.setProperty('--font-scale', e.target.value));
    document.getElementById('high-contrast').addEventListener('change',e=>document.body.classList.toggle('high-contrast', e.target.checked));
  }
  update(){
    const p=this.scene.player; const pr=this.scene.systemsMap.progression; const e=this.scene.systemsMap.economy;
    this.text.setText(`HP ${p.hp.toFixed(0)}/${p.stats.hp.toFixed(0)}  EN ${p.energy.toFixed(0)}  Lv ${pr.level} XP ${pr.xp}/${pr.next}  Gold ${e.gold} Dist ${Math.floor(this.scene.distance/10)}m`);
  }
  togglePause(){ this.paused=!this.paused; this.scene.scene.pause(); if(!this.paused) this.scene.scene.resume(); this.menu.classList.toggle('hidden', !this.paused); }
}
