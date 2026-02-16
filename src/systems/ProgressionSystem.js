import { progressionConfig } from '../config/progressionConfig.js';
import { EventBus } from '../core/EventBus.js';
import { EVENTS } from '../core/Constants.js';

export default class ProgressionSystem {
  constructor(scene) {
    this.scene = scene;
  }

  init() {
    this.scene.state.player.recalcStats();
  }

  getXpNeeded(level) {
    return progressionConfig.xpFormula(level);
  }

  update(now) {
    const p = this.scene.state.player;
    while (p.level < progressionConfig.levelCap) {
      const needed = this.getXpNeeded(p.level);
      if (p.xp < needed) break;
      p.xp -= needed;
      p.level += 1;
      p.recalcStats();
      p.hp = p.maxHp;
      p.energy = p.maxEnergy;
      p.gold += 18 + p.level * 2;
      this.scene.systemsRef.talent.onLevelUp(p.level);
      this.scene.systemsRef.ui.toast(`Level Up! Lv ${p.level}`);
      this.scene.systemsRef.vfx.levelUpBurst(p.x, p.y - 20);
      this.scene.systemsRef.audio.play('levelup');
      EventBus.emit(EVENTS.PLAYER_LEVELED, p.level);
    }
  }
}
