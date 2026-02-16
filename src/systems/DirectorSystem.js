import { EVENTS } from '../core/Constants.js';
import { EventBus } from '../core/EventBus.js';

export default class DirectorSystem {
  constructor(scene) {
    this.scene = scene;
    this.intensity = 0.35;
    this.mode = 'breath';
    this.nextModeSwitchAt = 0;
    this.lastPlayerDamageAt = -9999;
    this.recentKills = 0;
    this.currentTier = 0;
  }

  init(now) {
    this.nextModeSwitchAt = now + 18000;
    EventBus.on(EVENTS.PLAYER_DAMAGED, () => { this.lastPlayerDamageAt = performance.now(); }, this);
    EventBus.on(EVENTS.ENEMY_DIED, () => { this.recentKills += 1; }, this);
  }

  update(now, deltaMs) {
    if (now >= this.nextModeSwitchAt) {
      if (this.mode === 'breath') {
        this.mode = 'peak';
        this.nextModeSwitchAt = now + 10000;
        EventBus.emit(EVENTS.DIRECTOR_PEAK);
      } else {
        this.mode = 'breath';
        this.nextModeSwitchAt = now + 15000;
        EventBus.emit(EVENTS.DIRECTOR_BREATH);
      }
    }

    const dist = this.scene.state.player.distance;
    this.currentTier = Phaser.Math.Clamp(Math.floor(dist / 800), 0, 4);

    const killPush = Math.min(0.18, this.recentKills * 0.01);
    this.recentKills *= 0.96;

    const dmgDecay = (now - this.lastPlayerDamageAt < 2200) ? -0.03 : 0.02;
    const target = (this.mode === 'peak' ? 0.86 : 0.42) + killPush + dmgDecay + this.currentTier * 0.04;
    this.intensity = Phaser.Math.Linear(this.intensity, Phaser.Math.Clamp(target, 0.2, 1.0), 0.03);
  }

  getSpawnMultiplier() {
    return this.intensity;
  }

  getTier() {
    return this.currentTier;
  }

  isBreathingWindow() {
    return this.mode === 'breath' && this.intensity < 0.5;
  }
}
