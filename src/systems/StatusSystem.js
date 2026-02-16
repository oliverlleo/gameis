import { combatConfig } from '../config/combatConfig.js';

export default class StatusSystem {
  constructor(scene) {
    this.scene = scene;
    this.freezeDR = new Map();
  }

  apply(target, status, payload, now) {
    if (!target?.active) return;
    if (status === 'freeze' && target.isBoss) {
      payload = { ...payload, potency: Math.min(payload.potency || 0.4, 0.35), durationMs: Math.min(payload.durationMs || 1000, 600) };
    }
    if (target.applyStatus) {
      const base = combatConfig.statuses[status] || {};
      target.applyStatus(status, {
        durationMs: payload.durationMs || base.durationMs || 1000,
        potency: payload.potency || base.baseDot || base.slowPct || 0.1,
        stacks: payload.stacks || 1,
        maxStacks: payload.maxStacks || base.maxStacks || 4
      }, now);
    }
  }

  cleanse(target, names = []) {
    if (!target?.statuses) return;
    for (const n of names) target.statuses.delete(n);
  }

  update(now, deltaSec) {
    const groups = this.scene.state.groups;
    for (const e of groups.enemies.getChildren()) {
      if (!e.active || !e.getAlive?.()) continue;
      e.updateStatuses(now, deltaSec, this.scene.systemsRef);
      this.applyOngoingModifiers(e);
    }
    const p = this.scene.state.player;
    this.applyOngoingModifiers(p);
  }

  applyOngoingModifiers(target) {
    if (!target?.active) return;
    if (!target.statuses) return;
    const fr = target.statuses.get('freeze');
    if (fr) {
      if (fr.potency >= 1) {
        target.body.velocity.x *= 0.2;
      } else {
        target.body.velocity.x *= (1 - Math.min(0.85, fr.potency));
      }
    }
    const shock = target.statuses.get('shock');
    if (shock) {
      target.shockAmp = 1 + shock.potency;
    } else {
      target.shockAmp = 1;
    }
  }
}
