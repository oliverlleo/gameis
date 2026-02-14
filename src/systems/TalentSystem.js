import { talents, talentSynergies } from '../config/talentConfig.js';

export class TalentSystem {
  constructor(scene) {
    this.scene = scene;
    this.pool = talents;
    this.synergies = talentSynergies;
    this.picked = [];
    this.nextPickLevel = 3;
  }

  init() {}

  onLevelUp(level) {
    if (level < this.nextPickLevel) return;
    this.nextPickLevel += 3;
    const choices = Phaser.Utils.Array.Shuffle(this.pool.filter(t => !this.picked.find(p => p.id === t.id))).slice(0, 3);
    const pick = choices[0];
    if (!pick) return;
    this.picked.push(pick);
    this.applyTalent(pick.id);
  }

  applyTalent(id) {
    const p = this.scene.player;
    if (id === 'focus_1') p.maxEnergy += 15;
    if (id === 'aegis_1') p.maxHp += 25;
    if (id === 'focus_2') this.energyRegenBonus = (this.energyRegenBonus || 0) + 0.8;
  }

  has(id) { return this.picked.some(p => p.id === id); }

  update(dt) {
    if (this.energyRegenBonus) this.scene.player.energy = Math.min(this.scene.player.maxEnergy, this.scene.player.energy + (this.energyRegenBonus * dt / 1000));
  }
}
