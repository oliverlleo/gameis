import { EventBus } from '../core/EventBus.js';

export class UISystem {
  constructor(scene) { this.scene = scene; }
  init() {
    this.text = this.scene.add.text(12, 8, '', { fontSize: '16px', color: '#fff' }).setScrollFactor(0).setDepth(999);
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
    this.text.setText(`HP ${Math.round(p.hp)}  EN ${Math.round(p.energy)}  LV ${prog.level}  XP ${prog.xp}/${prog.nextXp}  Gold ${prog.gold}  Dist ${Math.round(p.sprite.x)}`);
  }
}
