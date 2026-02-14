import { GAME_KEY, SAVE_VERSION } from '../core/Constants.js';

export class SaveSystem {
  constructor(scene) { this.scene = scene; }

  init() {
    this.load();
    this.scene.time.addEvent({ delay: 8000, loop: true, callback: () => this.save() });
  }

  save() {
    const p = this.scene.player;
    const prog = this.scene.systemsBag.prog;
    const talent = this.scene.systemsBag.talent;

    const payload = {
      version: SAVE_VERSION,
      player: { hp: p.hp, maxHp: p.maxHp, energy: p.energy, maxEnergy: p.maxEnergy, x: p.sprite.x },
      prog: { level: prog.level, xp: prog.xp, nextXp: prog.nextXp, gold: prog.gold },
      talents: talent.picked.map(t => t.id),
      runSeed: this.scene.systemsBag.chunk.seed,
    };

    localStorage.setItem(GAME_KEY, JSON.stringify(payload));
  }

  load() {
    try {
      const raw = JSON.parse(localStorage.getItem(GAME_KEY) || 'null');
      if (!raw || raw.version !== SAVE_VERSION) return;

      localStorage.setItem('runSeed', raw.runSeed);
      this.scene.time.delayedCall(50, () => {
        const p = this.scene.player;
        const prog = this.scene.systemsBag.prog;

        if (raw.player) {
          p.hp = raw.player.hp ?? p.hp;
          p.maxHp = raw.player.maxHp ?? p.maxHp;
          p.energy = raw.player.energy ?? p.energy;
          p.maxEnergy = raw.player.maxEnergy ?? p.maxEnergy;
          p.sprite.x = raw.player.x ?? p.sprite.x;
        }
        if (raw.prog) {
          prog.level = raw.prog.level ?? prog.level;
          prog.xp = raw.prog.xp ?? prog.xp;
          prog.nextXp = raw.prog.nextXp ?? prog.nextXp;
          prog.gold = raw.prog.gold ?? prog.gold;
        }
      });
    } catch {
      localStorage.removeItem(GAME_KEY);
    }
  }
}
