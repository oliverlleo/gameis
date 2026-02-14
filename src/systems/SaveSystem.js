import { GAME_KEY, SAVE_VERSION } from '../core/Constants.js';

export class SaveSystem {
  constructor(scene) { this.scene = scene; }
  init() { this.load(); this.scene.time.addEvent({ delay: 8000, loop: true, callback: () => this.save() }); }
  save() {
    const p = this.scene.player; const prog = this.scene.systemsBag.prog;
    localStorage.setItem(GAME_KEY, JSON.stringify({ version: SAVE_VERSION, player: { hp: p.hp, energy: p.energy, x: p.sprite.x }, prog: { level: prog.level, xp: prog.xp, gold: prog.gold }, runSeed: this.scene.systemsBag.chunk.seed }));
  }
  load() {
    try {
      const raw = JSON.parse(localStorage.getItem(GAME_KEY) || 'null');
      if (!raw || raw.version !== SAVE_VERSION) return;
      localStorage.setItem('runSeed', raw.runSeed);
    } catch { localStorage.removeItem(GAME_KEY); }
  }
}
