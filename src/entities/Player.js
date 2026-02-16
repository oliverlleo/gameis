import { progressionConfig } from '../config/progressionConfig.js';
import { combatConfig } from '../config/combatConfig.js';
import { physicsConfig } from '../config/physicsConfig.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(false);
    this.setDepth(20);
    this.body.setSize(18, 30).setOffset(3, 2);

    this.facing = 1;
    this.grounded = false;
    this.lastGroundedAt = 0;
    this.lastJumpPressAt = -9999;
    this.lastDamageAt = -9999;

    this.level = 1;
    this.xp = 0;
    this.gold = 0;
    this.distance = 0;
    this.comboStep = 0;
    this.lastComboAt = -9999;
    this.attackState = null;
    this.attackStateSince = 0;
    this.heavyQueued = false;
    this.isCasting = false;
    this.castLockUntil = 0;
    this.iframesUntil = 0;
    this.contactDamageCooldownUntil = 0;

    this.skillLevels = {
      ascendingRupture: 1,
      shadowStep: 1,
      flowBlade: 1,
      freezingPrism: 1,
      overloadCore: 1
    };
    this.cooldowns = {
      ascendingRupture: 0,
      shadowStep: 0,
      flowBlade: 0,
      freezingPrism: 0,
      overloadCore: 0
    };

    this.statuses = new Map();
    this.talents = [];
    this.talentBonuses = {};

    this.baseStats = { ...progressionConfig.basePlayerStats };
    this.currentStats = { ...this.baseStats };
    this.maxHp = this.baseStats.maxHp;
    this.hp = this.maxHp;
    this.maxEnergy = this.baseStats.maxEnergy;
    this.energy = this.maxEnergy;
  }

  recalcStats() {
    const lvl = this.level - 1;
    const g = progressionConfig.perLevelGains;
    const b = progressionConfig.basePlayerStats;
    const t = this.talentBonuses;

    this.currentStats.maxHp = Math.round(b.maxHp + lvl * g.maxHp + (t.maxHp || 0));
    this.currentStats.attack = +(b.attack + lvl * g.attack + (t.attack || 0)).toFixed(2);
    this.currentStats.maxEnergy = Math.round(b.maxEnergy + lvl * g.maxEnergy + (t.maxEnergy || 0));
    this.currentStats.defense = +(b.defense + lvl * g.defense + (t.defense || 0)).toFixed(2);
    this.currentStats.critChance = Math.max(0, b.critChance + lvl * g.critChance + (t.critChance || 0));
    this.currentStats.critMultiplier = b.critMultiplier + (t.critMultiplier || 0);
    this.currentStats.skillSpeed = b.skillSpeed + lvl * g.skillSpeed + (t.skillSpeed || 0);
    this.currentStats.energyRegenPerSec = (b.energyRegenPerSec + (t.energyRegen || 0));
    this.currentStats.hpRegenPerSec = (b.hpRegenPerSec + (t.hpRegen || 0));

    const hpRatio = this.hp / Math.max(1, this.maxHp);
    const enRatio = this.energy / Math.max(1, this.maxEnergy);

    this.maxHp = this.currentStats.maxHp;
    this.maxEnergy = this.currentStats.maxEnergy;
    this.hp = Math.min(this.maxHp, Math.max(1, Math.round(this.maxHp * hpRatio)));
    this.energy = Math.min(this.maxEnergy, Math.max(0, Math.round(this.maxEnergy * enRatio)));
  }

  updateVitals(deltaSec) {
    this.energy = Math.min(this.maxEnergy, this.energy + this.currentStats.energyRegenPerSec * deltaSec);
    this.hp = Math.min(this.maxHp, this.hp + this.currentStats.hpRegenPerSec * deltaSec);
  }

  pressJump(ts) {
    this.lastJumpPressAt = ts;
  }

  canTakeDamage(ts) {
    return ts >= this.iframesUntil;
  }

  setIFrames(ms, ts) {
    this.iframesUntil = Math.max(this.iframesUntil, ts + ms);
  }

  receiveDamage(amount, ts, knockbackX = 0, knockbackY = -140) {
    if (!this.canTakeDamage(ts)) return false;
    const mitigated = Math.max(1, amount - this.currentStats.defense * 0.35);
    this.hp = Math.max(0, this.hp - mitigated);
    this.lastDamageAt = ts;
    this.setIFrames(physicsConfig.player.invulnMs, ts);

    const kbX = Phaser.Math.Clamp(knockbackX, -physicsConfig.player.knockbackClampX, physicsConfig.player.knockbackClampX);
    const kbY = Phaser.Math.Clamp(knockbackY, -physicsConfig.player.knockbackClampY, physicsConfig.player.knockbackClampY);
    this.body.velocity.x += kbX;
    this.body.velocity.y = Math.min(this.body.velocity.y, kbY);

    if (this.hp <= 0) {
      this.setTint(0x330000);
    } else {
      this.setTint(0xffd1d1);
      this.scene.time.delayedCall(100, () => this.clearTint());
    }
    return true;
  }

  canSpendEnergy(cost) {
    return this.energy >= cost;
  }

  spendEnergy(cost) {
    if (this.energy < cost) return false;
    this.energy -= cost;
    return true;
  }

  gainGold(amount) {
    this.gold += Math.max(0, Math.round(amount));
  }

  gainXp(amount) {
    this.xp += Math.max(0, Math.round(amount));
  }

  resetCombo(ts) {
    if (ts - this.lastComboAt > combatConfig.combo.resetWindowMs) {
      this.comboStep = 0;
    }
  }

  nextComboStep(heavy = false) {
    if (heavy) {
      this.comboStep = 3;
      return combatConfig.combo.chain[3];
    }
    const step = this.comboStep % 3;
    this.comboStep = step + 1;
    return combatConfig.combo.chain[step];
  }

  setAttackState(stateKey, ts) {
    this.attackState = stateKey;
    this.attackStateSince = ts;
    this.lastComboAt = ts;
  }

  clearAttackState() {
    this.attackState = null;
    this.heavyQueued = false;
  }

  isAlive() {
    return this.hp > 0;
  }

  canCast(ts) {
    return ts >= this.castLockUntil && !this.isCasting;
  }

  lockCast(ms, ts) {
    this.isCasting = true;
    this.castLockUntil = ts + ms;
    this.scene.time.delayedCall(ms, () => { this.isCasting = false; });
  }

  getCooldownRemaining(skillId, ts) {
    return Math.max(0, (this.cooldowns[skillId] || 0) - ts);
  }

  setCooldown(skillId, ms, ts) {
    this.cooldowns[skillId] = ts + ms;
  }

  facingSign() {
    return this.facing >= 0 ? 1 : -1;
  }

  updateFacingFromVelocity() {
    if (Math.abs(this.body.velocity.x) > 20) {
      this.facing = this.body.velocity.x >= 0 ? 1 : -1;
      this.setFlipX(this.facing < 0);
    }
  }
}
