import { spawnConfig } from '../config/spawnConfig.js';
import { applyEliteVariant } from '../entities/EliteVariants.js';
import EnemyMelee from '../entities/EnemyMelee.js';
import EnemyRanged from '../entities/EnemyRanged.js';
import EnemyTank from '../entities/EnemyTank.js';
import EnemySupport from '../entities/EnemySupport.js';
import EnemySummoner from '../entities/EnemySummoner.js';
import EnemyAssassin from '../entities/EnemyAssassin.js';
import BossA from '../entities/BossA.js';
import BossB from '../entities/BossB.js';
import { EventBus } from '../core/EventBus.js';
import { EVENTS } from '../core/Constants.js';

const classMap = {
  melee: EnemyMelee,
  ranged: EnemyRanged,
  tank: EnemyTank,
  support: EnemySupport,
  summoner: EnemySummoner,
  assassin: EnemyAssassin
};

export default class SpawnSystem {
  constructor(scene) {
    this.scene = scene;
    this.spawnedChunks = new Set();
    this.lastBossThresholdIndex = -1;
    this.zoneCooldownUntil = 0;
  }

  init() {
    EventBus.on(EVENTS.CHUNK_READY, (chunk) => this.onChunkReady(chunk), this);
  }

  onChunkReady(chunk) {
    if (this.spawnedChunks.has(chunk.index)) return;
    this.spawnedChunks.add(chunk.index);

    const now = performance.now();
    const director = this.scene.systemsRef.director;
    const tier = director.getTier();
    const density = spawnConfig.baseDensityByTier[Math.min(tier, spawnConfig.baseDensityByTier.length - 1)] * director.getSpawnMultiplier();

    const packCount = Phaser.Math.Clamp(Math.floor(1 + density * 2.2), 1, 5);
    for (let i = 0; i < packCount; i++) {
      this.spawnPack(chunk, tier, now);
    }

    if (Math.random() < 0.42) {
      this.spawnRareEvent(chunk);
    }

    this.trySpawnBoss();
  }

  spawnPack(chunk, tier, now) {
    const anchors = chunk.spawnAnchors;
    if (!anchors?.length) return;
    const anchor = Phaser.Utils.Array.GetRandom(anchors);
    const count = Phaser.Math.Between(1, 3 + Math.floor(tier / 2));

    for (let i = 0; i < count; i++) {
      const def = this.pickEnemyType(tier);
      const cls = classMap[def.classKey] || EnemyMelee;
      const x = anchor.x + Phaser.Math.Between(-95, 95);
      const y = anchor.y - 30;
      if (!this.isSafeSpawnPosition(x)) continue;
      const enemy = new cls(this.scene, x, y, this.scaleEnemyDef(def, tier));
      this.scene.state.groups.enemies.add(enemy);

      const eliteChance = spawnConfig.eliteChanceByTier[Math.min(tier, spawnConfig.eliteChanceByTier.length - 1)];
      if (Math.random() < eliteChance) {
        const variant = Phaser.Utils.Array.GetRandom(spawnConfig.eliteVariants);
        applyEliteVariant(enemy, variant);
      }
    }
  }

  pickEnemyType(tier) {
    const list = spawnConfig.enemyTypes.filter((e) => e.tierBias <= tier + 1);
    return Phaser.Utils.Array.GetRandom(list.length ? list : spawnConfig.enemyTypes);
  }

  scaleEnemyDef(def, tier) {
    const hp = Math.round(def.hp * (1 + tier * 0.19));
    const dmg = Math.round(def.dmg * (1 + tier * 0.13));
    const speed = Math.round(def.speed * (1 + tier * 0.03));
    return { ...def, hp, dmg, speed };
  }

  isSafeSpawnPosition(x) {
    const player = this.scene.state.player;
    return Math.abs(x - player.x) >= spawnConfig.safeSpawnDistanceFromPlayer;
  }

  spawnMinion(x, y) {
    const def = { id: 'spawnling', classKey: 'melee', hp: 42, dmg: 9, speed: 165 };
    const e = new EnemyMelee(this.scene, x, y, def);
    e.setScale(0.82);
    this.scene.state.groups.enemies.add(e);
    return e;
  }

  spawnRareEvent(chunk) {
    const eventType = Phaser.Utils.Array.GetRandom(spawnConfig.rareEvents);
    const x = chunk.x + Phaser.Math.Between(300, chunk.width - 300);
    const y = this.scene.config.world.groundY - 18;
    const marker = this.scene.add.rectangle(x, y, 24, 24, 0xfff3a8, 0.9).setDepth(14);
    this.scene.physics.add.existing(marker, true);
    marker.eventType = eventType;
    this.scene.state.groups.events.add(marker);

    this.scene.physics.add.overlap(this.scene.state.player, marker, () => {
      this.resolveEvent(marker);
    }, null, this);
  }

  resolveEvent(marker) {
    if (!marker.active) return;
    const type = marker.eventType;
    const p = this.scene.state.player;
    const ui = this.scene.systemsRef.ui;

    if (type === 'merchant') {
      ui.openShop();
      ui.toast('Merchant encountered');
    } else if (type === 'risk_altar') {
      const hpCost = Math.round(p.maxHp * 0.18);
      p.hp = Math.max(1, p.hp - hpCost);
      this.scene.systemsRef.talent.grantRandomTalent('rare');
      ui.toast(`Risk Altar: -${hpCost} HP, talent gained`);
    } else if (type === 'cursed_chest') {
      p.receiveDamage(Math.round(p.maxHp * 0.1), performance.now(), 0, -40);
      this.scene.systemsRef.loot.spawnBurst(marker.x, marker.y - 20, 5, 'epic');
      ui.toast('Cursed Chest exploded with loot');
    } else if (type === 'arena_lock') {
      ui.toast('Arena lock: survive 15s');
      this.scene.systemsRef.director.mode = 'peak';
      this.scene.systemsRef.director.nextModeSwitchAt = performance.now() + 15000;
    } else if (type === 'healing_sanctuary') {
      p.hp = Math.min(p.maxHp, p.hp + Math.round(p.maxHp * 0.35));
      ui.toast('Healing sanctuary restored HP');
    } else if (type === 'roaming_miniboss') {
      this.spawnMiniBoss(marker.x + 120, marker.y - 20);
      ui.toast('Mini-boss awakened');
    } else if (type === 'loot_storm') {
      this.scene.systemsRef.loot.spawnBurst(marker.x, marker.y - 30, 8, 'rare');
      ui.toast('Loot storm');
    } else if (type === 'time_distortion') {
      p.setCooldown('overloadCore', 0, 0);
      p.energy = Math.min(p.maxEnergy, p.energy + 45);
      ui.toast('Time distortion: cooldown reset');
    } else if (type === 'blessing_shrine') {
      p.talentBonuses.attack = (p.talentBonuses.attack || 0) + 4;
      p.recalcStats();
      ui.toast('Blessing Shrine: +4 Attack');
    } else if (type === 'echo_cache') {
      p.gainGold(90);
      p.gainXp(130);
      ui.toast('Echo cache: gold + xp');
    }

    marker.destroy();
  }

  spawnMiniBoss(x, y) {
    const tier = this.scene.systemsRef.director.getTier() + 1;
    const b = Math.random() < 0.5 ? new BossA(this.scene, x, y, tier) : new BossB(this.scene, x, y, tier);
    b.setScale(b.scaleX * 0.75);
    b.maxHp = Math.round(b.maxHp * 0.44);
    b.hp = b.maxHp;
    b.attackDamage = Math.round(b.attackDamage * 0.75);
    b.isMiniBoss = true;
    this.scene.state.groups.enemies.add(b);
  }

  trySpawnBoss() {
    const dist = this.scene.state.player.distance * 10;
    const idx = spawnConfig.bossDistanceThresholds.findIndex((d) => dist < d);
    const triggerIndex = idx === -1 ? spawnConfig.bossDistanceThresholds.length - 1 : Math.max(0, idx - 1);
    if (triggerIndex <= this.lastBossThresholdIndex) return;
    const threshold = spawnConfig.bossDistanceThresholds[triggerIndex];
    if (dist < threshold) return;
    this.lastBossThresholdIndex = triggerIndex;

    const tier = this.scene.systemsRef.director.getTier() + 1;
    const x = this.scene.state.player.x + 640;
    const y = this.scene.config.world.groundY - 40;
    const boss = (triggerIndex % 2 === 0) ? new BossA(this.scene, x, y, tier) : new BossB(this.scene, x, y, tier);
    this.scene.state.groups.enemies.add(boss);
    this.scene.systemsRef.ui.toast(`Boss Encounter: ${boss.bossName}`);
    this.scene.systemsRef.audio.setMusicState('boss');
  }

  update(now) {
    // off-screen despawn guard handled by performance system
    if (now < this.zoneCooldownUntil) return;
  }
}
