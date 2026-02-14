import { progressionConfig } from '../config/progressionConfig.js';
import { economyConfig } from '../config/economyConfig.js';

export class ProgressionSystem {
  constructor(scene) { this.scene = scene; this.level = 1; this.xp = 0; this.nextXp = progressionConfig.xpForLevel(1); this.gold = 0; }
  init() {}
  onEnemyDefeated(enemy) { this.gainXp(16); this.gold += Phaser.Math.Between(economyConfig.goldDrop.min, economyConfig.goldDrop.max); }
  gainXp(v) {
    this.xp += v;
    while (this.xp >= this.nextXp && this.level < progressionConfig.levelCap) {
      this.xp -= this.nextXp; this.level++; this.nextXp = progressionConfig.xpForLevel(this.level);
      this.scene.player.hp += progressionConfig.gainPerLevel.hp;
    }
  }
  collectLoot(r) { this.gold += 6; this.gainXp(4); }
}
