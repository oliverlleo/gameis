import EnemyBase from './EnemyBase.js';
import { bossConfig } from '../config/bossConfig.js';

export default class BossB extends EnemyBase {
  constructor(scene, x, y, tier = 1) {
    const cfg = bossConfig.bosses.bossB;
    super(scene, x, y, {
      id: 'bossB',
      classKey: 'boss',
      hp: Math.round(cfg.baseHp * (1 + tier * 0.2)),
      dmg: Math.round(cfg.baseDmg * (1 + tier * 0.12)),
      speed: cfg.speed,
      physRes: cfg.resistances.physical,
      arcaneRes: cfg.resistances.arcane,
      elementalRes: cfg.resistances.elemental,
      attackCdMs: 1420
    }, 'boss_b');
    this.isBoss = true;
    this.bossName = cfg.id;
    this.phase = 1;
    this.setScale(2.0);
    this.body.setSize(38, 54).setOffset(9, 10);
  }

  updatePhase() {
    const ratio = this.hp / this.maxHp;
    const next = ratio <= 0.35 ? 3 : ratio <= 0.7 ? 2 : 1;
    if (next !== this.phase) {
      this.phase = next;
      this.scene.systemsRef.vfx.phaseBurst(this.x, this.y, this.phase);
      this.scene.systemsRef.audio.play('boss_phase');
      this.attackDamage = Math.round(this.attackDamage * 1.12);
    }
  }

  updateAI(ts, deltaMs, context) {
    super.updateAI(ts, deltaMs, context);
    this.updatePhase();
  }
}
