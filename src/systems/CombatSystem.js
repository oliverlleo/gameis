import { combatConfig } from '../config/combatConfig.js';
import { physicsConfig } from '../config/physicsConfig.js';
import { EVENTS } from '../core/Constants.js';
import { EventBus } from '../core/EventBus.js';

export default class CombatSystem {
  constructor(scene) {
    this.scene = scene;
    this.pendingHitFrame = null;
  }

  update(deltaMs, now) {
    const pl = this.scene.state.player;
    if (!pl || !pl.isAlive()) return;
    const input = this.scene.systemsRef.input;

    pl.resetCombo(now);

    if (input.pressed('light') && !pl.isCasting) this.tryStartAttack(false, now);
    if (input.pressed('heavy') && !pl.isCasting) this.tryStartAttack(true, now);

    if (pl.attackState) {
      this.updateAttackState(now);
    }
  }

  tryStartAttack(isHeavy, now) {
    const pl = this.scene.state.player;
    if (pl.attackState) {
      if (isHeavy) pl.heavyQueued = true;
      return;
    }
    const phase = pl.nextComboStep(isHeavy);
    pl.setAttackState(phase.key, now);
    pl.setTint(0xdff5ff);
    this.scene.time.delayedCall(90, () => pl.clearTint());

    const totalFrames = phase.startupF + phase.activeF + phase.recoveryF;
    pl.attackMeta = {
      key: phase.key,
      startedAt: now,
      phase,
      didHit: false,
      activeFrom: now + phase.startupF * combatConfig.frameMs,
      activeTo: now + (phase.startupF + phase.activeF) * combatConfig.frameMs,
      endsAt: now + totalFrames * combatConfig.frameMs
    };
    this.scene.systemsRef.audio.play('attack');
  }

  updateAttackState(now) {
    const pl = this.scene.state.player;
    const m = pl.attackMeta;
    if (!m) return;

    if (!m.didHit && now >= m.activeFrom && now <= m.activeTo) {
      this.doMeleeArc(pl, m.phase);
      m.didHit = true;
    }

    if (now >= m.endsAt) {
      const wasHeavy = m.key === 'heavy';
      pl.clearAttackState();
      if (pl.heavyQueued && !wasHeavy) {
        this.tryStartAttack(true, now + 1);
      } else if (wasHeavy) {
        pl.comboStep = 0;
      }
    }
  }

  doMeleeArc(player, phase) {
    const enemies = this.scene.state.groups.enemies.getChildren().filter((e) => e.active && e.getAlive?.());
    const facing = player.facingSign();
    const range = phase.arc.range;
    const halfAngle = Phaser.Math.DegToRad(phase.arc.angle);
    const origin = new Phaser.Math.Vector2(player.x + facing * 16, player.y - 8);

    let hits = 0;
    for (const enemy of enemies) {
      const to = new Phaser.Math.Vector2(enemy.x - origin.x, enemy.y - origin.y);
      const dist = to.length();
      if (dist > range) continue;
      const ang = Phaser.Math.Angle.Wrap(to.angle() - (facing > 0 ? 0 : Math.PI));
      if (Math.abs(ang) > halfAngle) continue;

      const final = this.computeDamage(player, enemy, phase.damage, 'physical');
      const res = enemy.applyDamage(final.amount, final.type, performance.now(), player);
      if (res.dealt > 0) {
        hits++;
        const kb = phase.knockback * (enemy.isBoss ? 0.3 : enemy.isElite ? 0.55 : 1);
        enemy.applyKnockback(facing * kb, -90);
        enemy.hitstunUntil = performance.now() + (enemy.isBoss ? physicsConfig.combatFeel.hitstun.boss : enemy.isElite ? physicsConfig.combatFeel.hitstun.elite : physicsConfig.combatFeel.hitstun.common);
        this.scene.systemsRef.vfx.hitSpark(enemy.x, enemy.y - 8, final.crit ? 0xfff1a8 : 0xffffff);
        this.scene.systemsRef.vfx.hitFlash(enemy);
        this.scene.systemsRef.audio.play(final.crit ? 'crit' : 'hit');
        if (res.killed) {
          EventBus.emit(EVENTS.ENEMY_DIED, enemy, player);
        }
        if (enemy.reflectPct && !enemy.isBoss) {
          player.receiveDamage(Math.max(1, final.amount * enemy.reflectPct), performance.now(), -facing * 80, -100);
        }
      }
    }

    if (hits > 0) {
      const hitstop = phase.key === 'heavy' ? physicsConfig.combatFeel.hitstopHeavyMs : physicsConfig.combatFeel.hitstopLightMs;
      this.hitstop(hitstop);
    }
  }

  computeDamage(player, enemy, baseDamage, damageType = 'physical') {
    const st = player.currentStats;
    const statuses = enemy.statuses || new Map();
    let mult = 1 + st.attack / 100;
    if (statuses.has('shock')) mult *= 1.15;
    if (statuses.has('freeze') && damageType === 'arcane') mult *= 1.08;
    if (player.talentBonuses.skillDamage && damageType !== 'physical') mult *= (1 + player.talentBonuses.skillDamage);
    let amount = baseDamage * mult;

    const critChance = st.critChance;
    const crit = Math.random() < critChance;
    if (crit) amount *= st.critMultiplier;

    return { amount: Math.max(1, Math.round(amount)), crit, type: damageType };
  }

  resolveProjectileHitEnemy(projectile, enemy) {
    if (!projectile.active || !enemy.active || !enemy.getAlive?.()) return;
    const pl = this.scene.state.player;
    const final = this.computeDamage(pl, enemy, projectile.damage, projectile.damageType);
    const res = enemy.applyDamage(final.amount, final.type, performance.now(), pl);
    if (res.dealt > 0) {
      enemy.applyKnockback(Math.sign(projectile.body.velocity.x) * 140, -80);
      this.scene.systemsRef.vfx.hitSpark(enemy.x, enemy.y, 0x9fe2ff);
      this.scene.systemsRef.audio.play('hit');
      projectile.pierce -= 1;
      if (projectile.onHit) projectile.onHit(enemy, this.scene);
      if (res.killed) EventBus.emit(EVENTS.ENEMY_DIED, enemy, pl);
      if (projectile.pierce < 0) projectile.recycle();
    }
  }

  resolveProjectileHitPlayer(projectile, player) {
    if (!projectile.active || !player.isAlive()) return;
    const now = performance.now();
    const kx = Math.sign(projectile.body.velocity.x) * 180;
    const hit = player.receiveDamage(projectile.damage, now, kx, -160);
    if (hit) {
      this.scene.systemsRef.vfx.hitSpark(player.x, player.y - 8, 0xff7777);
      this.scene.systemsRef.audio.play('hurt');
      projectile.recycle();
      EventBus.emit(EVENTS.PLAYER_DAMAGED, projectile.damage);
    }
  }

  enemyDoAttack(enemy, dist, dx, dy, now) {
    const player = this.scene.state.player;
    if (!player.isAlive()) return;
    const arche = enemy.archetype;
    const dir = Math.sign(dx || 1);
    if (arche === 'ranged' || arche === 'support' || arche === 'summoner') {
      const p = this.scene.systemsRef.performance.getProjectile(enemy);
      const speed = arche === 'support' ? 360 : 460;
      const vx = (dx / dist) * speed;
      const vy = (dy / dist) * speed;
      const tint = arche === 'support' ? 0x7dffc1 : arche === 'summoner' ? 0xc5b3ff : 0xffc089;
      p.fire(enemy.x, enemy.y - 6, vx, vy, {
        owner: 'enemy',
        damage: arche === 'support' ? Math.round(enemy.attackDamage * 0.8) : enemy.attackDamage,
        damageType: arche === 'summoner' ? 'arcane' : 'physical',
        lifeMs: 2400,
        tint
      }, now);
      if (arche === 'support') {
        this.healNearbyAllies(enemy, Math.round(enemy.attackDamage * 0.55));
      } else if (arche === 'summoner' && Math.random() < 0.35) {
        this.scene.systemsRef.spawn.spawnMinion(enemy.x + dir * 36, enemy.y - 8);
      }
      this.scene.systemsRef.audio.play('enemy_shot');
    } else if (arche === 'assassin') {
      enemy.body.velocity.x = dir * 340;
      const hit = player.receiveDamage(enemy.attackDamage * 1.08, now, dir * 260, -180);
      if (hit) this.scene.systemsRef.vfx.hitSpark(player.x, player.y - 8, 0xffbaba);
    } else if (arche === 'boss') {
      const phaseMult = enemy.phase === 3 ? 1.35 : enemy.phase === 2 ? 1.15 : 1.0;
      if (Math.random() < 0.42) {
        this.bossAreaAttack(enemy, phaseMult, now);
      } else {
        const hit = player.receiveDamage(Math.round(enemy.attackDamage * phaseMult), now, dir * 300, -220);
        if (hit) this.scene.systemsRef.vfx.flash('boss-hit');
      }
    } else {
      const dmg = arche === 'tank' ? enemy.attackDamage * 1.15 : enemy.attackDamage;
      const kb = arche === 'tank' ? 300 : 220;
      const hit = player.receiveDamage(Math.round(dmg), now, dir * kb, -180);
      if (hit) this.scene.systemsRef.vfx.hitSpark(player.x, player.y - 8, 0xffb9b9);
    }
  }

  healNearbyAllies(sourceEnemy, amount) {
    const allies = this.scene.state.groups.enemies.getChildren().filter((e) => e.active && e !== sourceEnemy);
    for (const ally of allies) {
      const d = Phaser.Math.Distance.Between(ally.x, ally.y, sourceEnemy.x, sourceEnemy.y);
      if (d < 180) {
        ally.hp = Math.min(ally.maxHp, ally.hp + amount);
        this.scene.systemsRef.vfx.hitSpark(ally.x, ally.y - 8, 0x88ffcc);
      }
    }
  }

  bossAreaAttack(enemy, phaseMult, now) {
    const player = this.scene.state.player;
    this.scene.systemsRef.vfx.warnCircle(player.x, player.y, 90, 220);
    this.scene.time.delayedCall(240, () => {
      const d = Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y);
      if (d < 190) {
        player.receiveDamage(Math.round(enemy.attackDamage * 1.4 * phaseMult), performance.now(), Math.sign(player.x - enemy.x) * 340, -260);
        this.scene.systemsRef.vfx.flash('boss-impact');
      }
    });
  }

  canEnemyAttack(enemy) {
    const ai = this.scene.systemsRef.ai;
    return ai.reserveAttackSlot(enemy);
  }

  hitstop(ms) {
    this.scene.physics.world.isPaused = true;
    this.scene.time.delayedCall(ms, () => {
      this.scene.physics.world.isPaused = false;
    });
  }
}
