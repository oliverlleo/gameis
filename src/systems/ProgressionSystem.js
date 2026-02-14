import { progressionConfig } from '../config/progressionConfig.js';
import { economyConfig } from '../config/economyConfig.js';

export class ProgressionSystem {
  constructor(scene) {
    this.scene = scene;
    this.level = 1;
    this.xp = 0;
    this.nextXp = progressionConfig.xpForLevel(1);
    this.gold = 0;
  }

  init() {}

  onEnemyDefeated(enemy) {
    const bonus = enemy.type?.includes('boss') ? 120 : enemy.role === 'tank' ? 10 : 0;
    this.gainXp(16 + bonus);
    this.gold += Phaser.Math.Between(economyConfig.goldDrop.min, economyConfig.goldDrop.max) + bonus;
  }

  gainXp(v) {
    this.xp += v;
    while (this.xp >= this.nextXp && this.level < progressionConfig.levelCap) {
      this.xp -= this.nextXp;
      this.level += 1;
      this.nextXp = progressionConfig.xpForLevel(this.level);
      const g = progressionConfig.gainPerLevel;
      this.scene.player.maxHp += g.hp;
      this.scene.player.hp = Math.min(this.scene.player.maxHp, this.scene.player.hp + g.hp * 0.5);
      this.scene.player.maxEnergy += g.energy;
      this.scene.systemsBag.talent.onLevelUp(this.level);
    }
  }

  collectLoot() {
    this.gold += 6;
    this.gainXp(4);
  }
}
