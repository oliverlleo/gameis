import LootOrb from '../entities/LootOrb.js';
import { lootTables } from '../config/lootTables.js';
import { economyConfig } from '../config/economyConfig.js';
import { EventBus } from '../core/EventBus.js';
import { EVENTS } from '../core/Constants.js';

export default class LootSystem {
  constructor(scene) {
    this.scene = scene;
  }

  init() {
    EventBus.on(EVENTS.ENEMY_DIED, (enemy, player) => {
      this.onEnemyDied(enemy, player);
    }, this);
  }

  onEnemyDied(enemy, player) {
    const eco = economyConfig;
    const eliteMult = enemy.isElite ? eco.goldDrop.eliteMultiplier : 1;
    const bossMult = enemy.isBoss ? eco.goldDrop.bossMultiplier : 1;
    const totalMult = eliteMult * bossMult;

    const gold = Phaser.Math.Between(eco.goldDrop.baseMin, eco.goldDrop.baseMax) * totalMult;
    const xp = Phaser.Math.Between(eco.xpDrop.baseMin, eco.xpDrop.baseMax) * (enemy.isElite ? eco.xpDrop.eliteMultiplier : 1) * (enemy.isBoss ? eco.xpDrop.bossMultiplier : 1);

    this.spawnOrb(enemy.x, enemy.y - 12, { type: 'gold', value: Math.round(gold), rarity: enemy.isBoss ? 'epic' : enemy.isElite ? 'rare' : 'common' });
    this.spawnOrb(enemy.x + 12, enemy.y - 8, { type: 'xp', value: Math.round(xp), rarity: enemy.isBoss ? 'epic' : 'common' });

    const rollItemChance = enemy.isBoss ? 1 : enemy.isElite ? 0.45 : 0.14;
    if (Math.random() < rollItemChance) {
      const item = this.rollItem();
      this.spawnOrb(enemy.x - 10, enemy.y - 15, {
        type: 'item',
        value: 1,
        rarity: item.rarity,
        meta: item
      });
    }
  }

  rollItem() {
    const w = lootTables.rarityWeight;
    const total = Object.values(w).reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    let rarity = 'common';
    for (const k of Object.keys(w)) {
      r -= w[k];
      if (r <= 0) {
        rarity = k;
        break;
      }
    }
    const candidates = lootTables.drops.filter((d) => d.rarity === rarity);
    return Phaser.Utils.Array.GetRandom(candidates);
  }

  spawnOrb(x, y, dropData) {
    const orb = new LootOrb(this.scene, x, y);
    orb.initDrop({ ...dropData, now: performance.now() });
    this.scene.state.groups.loot.add(orb);
    orb.body.velocity.y = Phaser.Math.Between(-140, -60);
    orb.body.velocity.x = Phaser.Math.Between(-65, 65);
  }

  spawnBurst(x, y, count = 3, rarity = 'common') {
    for (let i = 0; i < count; i++) {
      if (Math.random() < 0.45) {
        this.spawnOrb(x + Phaser.Math.Between(-40, 40), y + Phaser.Math.Between(-30, 10), { type: 'gold', value: Phaser.Math.Between(12, 34), rarity });
      } else {
        const item = this.rollItem();
        this.spawnOrb(x + Phaser.Math.Between(-40, 40), y + Phaser.Math.Between(-30, 10), { type: 'item', value: 1, rarity: item.rarity, meta: item });
      }
    }
  }

  collectOrb(orb) {
    if (!orb.active) return;
    const p = this.scene.state.player;
    if (orb.type === 'gold') {
      p.gainGold(orb.value);
    } else if (orb.type === 'xp') {
      p.gainXp(orb.value);
    } else if (orb.type === 'item' && orb.meta) {
      this.scene.systemsRef.talent.applyLootItem(orb.meta);
      this.scene.systemsRef.ui.toast(`Picked ${orb.meta.id.replaceAll('_', ' ')}`);
    }
    this.scene.systemsRef.audio.play('pickup');
    orb.destroy();
    EventBus.emit(EVENTS.LOOT_PICKED, orb.type, orb.value);
  }

  update(now) {
    const p = this.scene.state.player;
    this.scene.state.groups.loot.getChildren().forEach((orb) => {
      orb.update(now, p);
    });
  }
}
