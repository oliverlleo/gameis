import { combatConfig } from '../config/combatConfig.js';

export class SkillSystem {
  constructor(scene) { this.scene = scene; this.cd = {}; }
  init() { this.bind(); }
  bind() {
    const keys = this.scene.player.keys;
    this.scene.input.keyboard.on('keydown-ONE', () => this.cast('ascendingRupture'));
    this.scene.input.keyboard.on('keydown-TWO', () => this.cast('shadowStep'));
    this.scene.input.keyboard.on('keydown-THREE', () => this.cast('flowBlade'));
    this.scene.input.keyboard.on('keydown-FOUR', () => this.cast('freezingPrism'));
    this.scene.input.keyboard.on('keydown-FIVE', () => this.cast('overloadCore'));
  }
  cast(name) {
    const s = combatConfig.skills[name], p = this.scene.player;
    const now = this.scene.time.now;
    if (!s || p.energy < s.cost || (this.cd[name] && now < this.cd[name])) return;
    p.energy -= s.cost; this.cd[name] = now + s.cd * 1000;
    if (name === 'shadowStep') p.sprite.x += p.facing * 120;
    this.scene.enemies.children.iterate((e) => {
      if (!e) return; const d = Phaser.Math.Distance.Between(e.x, e.y, p.sprite.x, p.sprite.y);
      if (d < 170) e.getData('entity')?.hurt(s.baseDamage);
    });
  }
  getCooldownLeft(name) { return Math.max(0, ((this.cd[name] || 0) - this.scene.time.now)/1000); }
}
