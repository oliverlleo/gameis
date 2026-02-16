import { STATES } from '../core/Constants.js';
import { aiConfig } from '../config/aiConfig.js';

export default class EnemyBase extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, def = {}, texture = 'enemy_melee') {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.def = def;
    this.enemyId = def.id || 'enemy';
    this.archetype = def.classKey || 'melee';
    this.isElite = false;
    this.eliteMutator = null;

    this.maxHp = def.hp || 100;
    this.hp = this.maxHp;
    this.attackDamage = def.dmg || 15;
    this.speed = def.speed || 120;
    this.mass = def.mass || 1;
    this.resistances = {
      physical: def.physRes || 0,
      arcane: def.arcaneRes || 0,
      elemental: def.elementalRes || 0
    };

    this.state = STATES.idle;
    this.stateSince = 0;
    this.lastAttackAt = -9999;
    this.attackCooldownMs = def.attackCdMs || 1000;
    this.lastRepathAt = 0;
    this.stuckSince = 0;
    this.lastPosX = x;
    this.lastPosY = y;
    this.statuses = new Map();
    this.hitstunUntil = 0;
    this.iframesUntil = 0;
    this.lastEvadeAt = -9999;
    this.target = null;
    this.groupRole = 'frontline';
    this.isBoss = false;

    this.setDepth(18);
    this.body.setSize(20, 28).setOffset(2, 4);
    this.setCollideWorldBounds(false);
  }

  setState(next, ts) {
    if (this.state === next) return;
    this.state = next;
    this.stateSince = ts;
  }

  getAlive() {
    return this.active && this.hp > 0 && this.state !== STATES.dead;
  }

  canTakeDamage(ts) {
    return ts >= this.iframesUntil;
  }

  applyDamage(raw, type = 'physical', ts = performance.now(), source = null) {
    if (!this.canTakeDamage(ts)) return { killed: false, dealt: 0 };
    const res = this.resistances[type] || 0;
    const dealt = Math.max(1, Math.round(raw * (1 - res)));
    this.hp = Math.max(0, this.hp - dealt);
    this.iframesUntil = ts + 40;
    if (this.hp <= 0) {
      this.setState(STATES.dead, ts);
      this.disableBody(false, false);
      this.setAlpha(0.3);
      this.scene.time.delayedCall(120, () => this.destroy());
      return { killed: true, dealt };
    }
    return { killed: false, dealt };
  }

  applyKnockback(x, y) {
    const massFactor = Phaser.Math.Clamp(1 / this.mass, 0.25, 1.5);
    this.body.velocity.x += x * massFactor;
    this.body.velocity.y += y * massFactor;
  }

  applyStatus(statusName, payload, ts) {
    const data = this.statuses.get(statusName) || { stacks: 0, expiresAt: 0, potency: 0, appliedAt: ts };
    data.stacks = Math.min((payload.maxStacks ?? 99), data.stacks + (payload.stacks || 1));
    data.potency = Math.max(data.potency, payload.potency || 0);
    data.expiresAt = Math.max(data.expiresAt, ts + payload.durationMs);
    data.appliedAt = ts;
    this.statuses.set(statusName, data);
  }

  updateStatuses(ts, deltaSec, systems) {
    for (const [name, s] of this.statuses) {
      if (ts >= s.expiresAt) {
        this.statuses.delete(name);
        continue;
      }
      if (name === 'burn') {
        s.tickAt = s.tickAt || ts;
        if (ts - s.tickAt >= 500) {
          s.tickAt = ts;
          this.applyDamage(Math.max(1, s.potency * s.stacks), 'elemental', ts);
        }
      } else if (name === 'bleed') {
        s.tickAt = s.tickAt || ts;
        if (ts - s.tickAt >= 400) {
          s.tickAt = ts;
          this.applyDamage(Math.max(1, s.potency * s.stacks), 'physical', ts);
        }
      }
    }
  }

  updateAI(ts, deltaMs, context = {}) {
    if (!this.getAlive()) return;
    if (!this.target || !this.target.active) return;
    if (ts < this.hitstunUntil) return;

    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const dist = Math.hypot(dx, dy);

    const attackRange = aiConfig.attackRange[this.archetype] || 70;
    const detectRange = aiConfig.detectRange;

    if (this.state === STATES.idle || this.state === STATES.patrol) {
      if (dist <= detectRange) this.setState(STATES.detect, ts);
    }

    if (this.state === STATES.detect || this.state === STATES.chase) {
      if (dist > aiConfig.disengageRange) {
        this.setState(STATES.retreat, ts);
      } else if (dist <= attackRange) {
        this.setState(STATES.attack, ts);
      } else {
        this.setState(STATES.chase, ts);
      }
    }

    if (this.state === STATES.chase) {
      const speedMult = this.statuses.has('freeze') ? 0.55 : 1;
      const v = Math.sign(dx) * this.speed * speedMult;
      this.body.setVelocityX(v);
      if (Math.abs(v) > 12) this.setFlipX(v < 0);

      this.detectStuck(ts);
      if (this.isStuck()) {
        this.body.setVelocityY(-340);
      }
    } else if (this.state === STATES.attack) {
      this.body.setVelocityX(this.body.velocity.x * 0.88);
      if (ts - this.lastAttackAt >= this.attackCooldownMs) {
        if (context.canAttack(this)) {
          context.doAttack(this, dist, dx, dy, ts);
          this.lastAttackAt = ts;
        }
      }
      if (dist > attackRange * 1.2) {
        this.setState(STATES.chase, ts);
      }
    } else if (this.state === STATES.retreat) {
      this.body.setVelocityX(Math.sign(-dx) * this.speed * 0.6);
      if (dist < detectRange * 0.8) this.setState(STATES.chase, ts);
    }
  }

  detectStuck(ts) {
    const moved = Phaser.Math.Distance.Between(this.x, this.y, this.lastPosX, this.lastPosY);
    if (moved < aiConfig.stuck.minTravelDistance) {
      if (!this.stuckSince) this.stuckSince = ts;
    } else {
      this.stuckSince = 0;
    }
    this.lastPosX = this.x;
    this.lastPosY = this.y;
  }

  isStuck(ts = performance.now()) {
    return this.stuckSince && (ts - this.stuckSince >= aiConfig.stuck.timeMs);
  }
}
