import EnemyBase from './EnemyBase.js';
import { bossConfig } from '../config/bossConfig.js';

export default class BossA extends EnemyBase {
  constructor(scene, x, y, tier = 1) {
    const cfg = bossConfig.bosses.bossA;
    super(scene, x, y, {
      id: 'bossA',
      classKey: 'boss',
      hp: Math.round(cfg.baseHp * (1 + tier * 0.18)),
      dmg: Math.round(cfg.baseDmg * (1 + tier * 0.11)),
      speed: cfg.speed,
      physRes: cfg.resistances.physical,
      arcaneRes: cfg.resistances.arcane,
      elementalRes: cfg.resistances.elemental,
      attackCdMs: 1350
    }, 'boss_a');
    this.isBoss = true;
    this.bossName = cfg.id;
    this.phase = 1;
    this.phaseThresholds = [0.7, 0.35];
    this.setScale(1.8);
    this.body.setSize(32, 48).setOffset(8, 10);
  }

  updatePhase() {
    const ratio = this.hp / this.maxHp;
    const newPhase = ratio <= 0.35 ? 3 : ratio <= 0.7 ? 2 : 1;
    if (newPhase !== this.phase) {
      this.phase = newPhase;
      this.scene.systemsRef.vfx.phaseBurst(this.x, this.y, this.phase);
      this.scene.systemsRef.audio.play('boss_phase');
      this.attackCooldownMs = Math.max(800, this.attackCooldownMs - 120);
      this.speed += 12;
    }
  }

  updateAI(ts, deltaMs, context) {
    super.updateAI(ts, deltaMs, context);
    this.updatePhase();
  }
}
