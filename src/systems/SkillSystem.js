import { combatConfig } from '../config/combatConfig.js';
import { EVENTS } from '../core/Constants.js';
import { EventBus } from '../core/EventBus.js';

export default class SkillSystem {
  constructor(scene) {
    this.scene = scene;
    this.skillOrder = ['ascendingRupture', 'shadowStep', 'flowBlade', 'freezingPrism', 'overloadCore'];
  }

  update(now) {
    const input = this.scene.systemsRef.input;
    const skillKeys = ['skill1', 'skill2', 'skill3', 'skill4', 'skill5'];
    for (let i = 0; i < skillKeys.length; i++) {
      if (input.pressed(skillKeys[i])) {
        const id = this.skillOrder[i];
        this.cast(id, now);
      }
    }
  }

  cast(skillId, now) {
    const player = this.scene.state.player;
    const sk = combatConfig.skills[skillId];
    if (!sk) return false;
    if (player.getCooldownRemaining(skillId, now) > 0) return false;
    if (!player.canSpendEnergy(sk.energy)) {
      this.scene.systemsRef.ui.toast('Not enough Energy');
      return false;
    }
    if (!player.canCast(now)) return false;

    player.spendEnergy(sk.energy);
    const speedScale = player.currentStats.skillSpeed;
    const cd = sk.cooldownMs / speedScale;
    player.setCooldown(skillId, cd, now);

    switch (skillId) {
      case 'ascendingRupture':
        this.castAscendingRupture(player, now);
        break;
      case 'shadowStep':
        this.castShadowStep(player, now);
        break;
      case 'flowBlade':
        this.castFlowBlade(player, now);
        break;
      case 'freezingPrism':
        this.castFreezingPrism(player, now);
        break;
      case 'overloadCore':
        this.castOverloadCore(player, now);
        break;
      default:
        break;
    }

    EventBus.emit(EVENTS.SKILL_CAST, skillId);
    return true;
  }

  castAscendingRupture(player, now) {
    const def = combatConfig.skills.ascendingRupture;
    player.lockCast(260, now);
    player.setIFrames(def.iFrameMs, now);
    this.scene.systemsRef.vfx.slashArc(player.x, player.y - 12, player.facingSign(), 120, 90, 0xb6e3ff);
    const enemies = this.scene.state.groups.enemies.getChildren().filter((e) => e.active && e.getAlive?.());
    for (const enemy of enemies) {
      if (Math.abs(enemy.x - player.x) < 90 && enemy.y > player.y - 120 && enemy.y < player.y + 80) {
        const bonus = player.skillLevels.ascendingRupture >= 2 && enemy.statuses.size > 0 ? 1.3 : 1;
        const dmg = Math.round(def.damage * bonus);
        const fin = this.scene.systemsRef.combat.computeDamage(player, enemy, dmg, def.type);
        const res = enemy.applyDamage(fin.amount, def.type, now, player);
        if (res.dealt > 0) {
          enemy.applyKnockback(player.facingSign() * 160, -380);
          this.scene.systemsRef.status.apply(enemy, 'shock', { durationMs: 1300, potency: 0.06, stacks: 1 }, now);
        }
      }
    }
    this.scene.systemsRef.audio.play('skill_cast');
  }

  castShadowStep(player, now) {
    const def = combatConfig.skills.shadowStep;
    player.lockCast(120, now);
    player.setIFrames(180, now);
    const dash = 190 + (player.skillLevels.shadowStep >= 2 ? 40 : 0);
    const dir = player.facingSign();
    player.body.velocity.x = dir * 520;
    player.x += dir * dash;
    this.scene.systemsRef.vfx.afterImage(player.x - dir * 44, player.y - 8, 0xabd1ff);
    this.scene.systemsRef.status.cleanse(player, ['freeze']);
    if (player.skillLevels.shadowStep >= 2) {
      const enemies = this.scene.state.groups.enemies.getChildren();
      for (const e of enemies) {
        if (!e.active) continue;
        if (Phaser.Math.Distance.Between(e.x, e.y, player.x - dir * 40, player.y) < 82) {
          const fin = this.scene.systemsRef.combat.computeDamage(player, e, def.damage, def.type);
          e.applyDamage(fin.amount, def.type, now, player);
          this.scene.systemsRef.status.apply(e, 'shock', { durationMs: 1400, potency: 0.1, stacks: 1 }, now);
        }
      }
    }
    this.scene.systemsRef.audio.play('dash');
  }

  castFlowBlade(player, now) {
    const def = combatConfig.skills.flowBlade;
    player.lockCast(360, now);
    const dir = player.facingSign();
    for (let i = 0; i < def.hitCount; i++) {
      this.scene.time.delayedCall(i * 70, () => {
        if (!player.active) return;
        this.scene.systemsRef.vfx.slashArc(player.x + dir * 16, player.y - 8, dir, 116, 66, 0xe2f6ff);
        const enemies = this.scene.state.groups.enemies.getChildren();
        for (const e of enemies) {
          if (!e.active || !e.getAlive?.()) continue;
          if (Math.abs(e.x - player.x) < 120 && Math.abs(e.y - player.y) < 65) {
            const fin = this.scene.systemsRef.combat.computeDamage(player, e, def.hitDamage, def.type);
            e.applyDamage(fin.amount, def.type, performance.now(), player);
            if (player.skillLevels.flowBlade >= 2) {
              const comboScale = 1 + (player.comboStep * 0.09);
              this.scene.systemsRef.status.apply(e, 'bleed', {
                durationMs: 4600,
                potency: Math.round(4 * comboScale),
                stacks: 1,
                maxStacks: 8
              }, performance.now());
            }
          }
        }
      });
    }
    this.scene.systemsRef.audio.play('skill_cast');
  }

  castFreezingPrism(player, now) {
    const def = combatConfig.skills.freezingPrism;
    player.lockCast(180, now);
    const dir = player.facingSign();
    const p = this.scene.systemsRef.performance.getPlayerProjectile();
    p.fire(player.x + dir * 18, player.y - 14, dir * 520, -20, {
      owner: 'player',
      damage: def.impact,
      damageType: def.type,
      lifeMs: 1800,
      tint: 0x8ec9ff,
      onHit: (enemy, scene) => {
        this.explodeFreezingPrism(enemy.x, enemy.y, player, now);
      }
    }, now);
    this.scene.systemsRef.audio.play('skill_cast');
  }

  explodeFreezingPrism(x, y, player, now) {
    const def = combatConfig.skills.freezingPrism;
    const r = player.skillLevels.freezingPrism >= 2 ? 160 : 132;
    this.scene.systemsRef.vfx.explosion(x, y, r, 0xa7d7ff);
    const enemies = this.scene.state.groups.enemies.getChildren();
    for (const e of enemies) {
      if (!e.active || !e.getAlive?.()) continue;
      const d = Phaser.Math.Distance.Between(x, y, e.x, e.y);
      if (d <= r) {
        const fin = this.scene.systemsRef.combat.computeDamage(player, e, def.explode, def.type);
        e.applyDamage(fin.amount, def.type, performance.now(), player);
        const fullChance = player.skillLevels.freezingPrism >= 2 ? 0.32 : 0.2;
        const full = Math.random() < fullChance && !e.isBoss && !e.isElite;
        this.scene.systemsRef.status.apply(e, 'freeze', {
          durationMs: full ? 1000 : 1300,
          potency: full ? 1 : 0.42,
          stacks: 1
        }, performance.now());
      }
    }
  }

  castOverloadCore(player, now) {
    const def = combatConfig.skills.overloadCore;
    player.lockCast(240, now);
    const enemies = this.scene.state.groups.enemies.getChildren().filter((e) => e.active && e.getAlive?.());
    let target = null;
    let best = Infinity;
    for (const e of enemies) {
      const d = Phaser.Math.Distance.Between(e.x, e.y, player.x, player.y);
      if (d < best && d < 330) { best = d; target = e; }
    }
    if (!target) {
      this.scene.systemsRef.ui.toast('No target in range');
      player.energy += def.energy * 0.6;
      player.cooldowns.overloadCore = now + 3000;
      return;
    }
    target.markedByOverload = true;
    this.scene.systemsRef.vfx.markTarget(target);
    this.scene.time.delayedCall(520, () => {
      if (!target.active || !target.getAlive?.()) return;
      const executeBonus = player.skillLevels.overloadCore >= 2 ? 0.08 : 0;
      const executePct = def.executePct + executeBonus;
      let dmg = def.detonate;
      if (target.hp / target.maxHp <= executePct) dmg += Math.round(target.maxHp * executePct);
      const fin = this.scene.systemsRef.combat.computeDamage(player, target, dmg, def.type);
      const res = target.applyDamage(fin.amount, def.type, performance.now(), player);
      this.scene.systemsRef.status.apply(target, 'shock', { durationMs: 3200, potency: 0.16, stacks: 1 }, performance.now());
      this.scene.systemsRef.vfx.explosion(target.x, target.y, 170, 0xd0b3ff);
      this.scene.systemsRef.audio.play('ultimate');
      if (res.killed) {
        this.scene.systemsRef.loot.spawnBurst(target.x, target.y, 4, 'rare');
      }
    });
  }
}
