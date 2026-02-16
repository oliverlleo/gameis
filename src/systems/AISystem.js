import { aiConfig } from '../config/aiConfig.js';

export default class AISystem {
  constructor(scene) {
    this.scene = scene;
    this.frontlineSlotsUsed = 0;
    this.backlineSlotsUsed = 0;
  }

  resetSlots() {
    this.frontlineSlotsUsed = 0;
    this.backlineSlotsUsed = 0;
  }

  reserveAttackSlot(enemy) {
    if (enemy.groupRole === 'backline') {
      if (this.backlineSlotsUsed >= aiConfig.simultaneousAttackers.backlineMax) return false;
      this.backlineSlotsUsed += 1;
      return true;
    }
    if (this.frontlineSlotsUsed >= aiConfig.simultaneousAttackers.frontlineMax) return false;
    this.frontlineSlotsUsed += 1;
    return true;
  }

  update(now, deltaMs) {
    const player = this.scene.state.player;
    if (!player.isAlive()) return;

    this.resetSlots();

    const combat = this.scene.systemsRef.combat;
    const enemies = this.scene.state.groups.enemies.getChildren();
    for (const enemy of enemies) {
      if (!enemy.active || !enemy.getAlive?.()) continue;
      enemy.target = player;

      if (enemy.eliteMutator === 'aura') {
        this.applyAura(enemy);
      }

      if (enemy.eliteMutator === 'spawnlings' && Math.random() < 0.0012) {
        this.scene.systemsRef.spawn.spawnMinion(enemy.x + Phaser.Math.Between(-40, 40), enemy.y - 12);
      }

      enemy.updateAI(now, deltaMs, {
        canAttack: (en) => this.reserveAttackSlot(en),
        doAttack: (...args) => combat.enemyDoAttack(...args)
      });
    }
  }

  applyAura(elite) {
    const enemies = this.scene.state.groups.enemies.getChildren();
    for (const e of enemies) {
      if (!e.active || e === elite || !e.getAlive?.()) continue;
      const d = Phaser.Math.Distance.Between(e.x, e.y, elite.x, elite.y);
      if (d <= elite.auraRadius) {
        e.attackDamageBuff = elite.auraBuff;
      } else {
        e.attackDamageBuff = 0;
      }
    }
  }
}
