export class UISystem {
  constructor(scene) { this.scene = scene; }
  init() {
    this.text = this.scene.add.text(12, 8, '', { fontSize: '16px', color: '#fff' }).setScrollFactor(0).setDepth(999);
    this.info = this.scene.add.text(12, 60, '', { fontSize: '14px', color: '#cde' }).setScrollFactor(0).setDepth(999);
    document.getElementById('btn-resume').onclick = () => this.togglePause(false);
    document.getElementById('btn-restart').onclick = () => location.reload();
    document.getElementById('btn-settings').onclick = () => document.getElementById('settings').classList.toggle('hidden');
    document.getElementById('close-settings').onclick = () => document.getElementById('settings').classList.add('hidden');
    this.scene.input.keyboard.on('keydown-ESC', () => this.togglePause(!this.scene.scene.isPaused()));
  }
  togglePause(p) { if (p) this.scene.scene.pause(); else this.scene.scene.resume(); document.getElementById('menu').classList.toggle('hidden', !p); }
  update() {
    const p = this.scene.player;
    const prog = this.scene.systemsBag.prog;
    const skills = this.scene.systemsBag.skills;
    const dir = this.scene.systemsBag.director;
    this.text.setText(`HP ${Math.round(p.hp)}/${Math.round(p.maxHp)} EN ${Math.round(p.energy)}/${Math.round(p.maxEnergy)} LV ${prog.level} XP ${prog.xp}/${prog.nextXp} Gold ${prog.gold} Dist ${Math.round(p.sprite.x)}`);
    this.info.setText(`CD [1:${skills.getCooldownLeft('ascendingRupture').toFixed(1)} 2:${skills.getCooldownLeft('shadowStep').toFixed(1)} 3:${skills.getCooldownLeft('flowBlade').toFixed(1)} 4:${skills.getCooldownLeft('freezingPrism').toFixed(1)} 5:${skills.getCooldownLeft('overloadCore').toFixed(1)}]  Event:${dir.lastEvent} Talents:${this.scene.systemsBag.talent.picked.length}`);
  }
}
