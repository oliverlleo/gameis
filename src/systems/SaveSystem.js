import { SAVE_SCHEMA_VERSION } from '../core/Constants.js';

const KEY = 'neon_frontier_save_v2';

export default class SaveSystem {
  constructor(scene) {
    this.scene = scene;
    this.autosaveEveryMs = 20000;
    this.nextAutoAt = 0;
  }

  init(now) {
    this.nextAutoAt = now + this.autosaveEveryMs;
  }

  buildSnapshot() {
    const p = this.scene.state.player;
    const t = this.scene.systemsRef.talent;
    return {
      schema: SAVE_SCHEMA_VERSION,
      savedAt: Date.now(),
      runSeed: this.scene.runSeed,
      player: {
        level: p.level,
        xp: p.xp,
        gold: p.gold,
        hp: p.hp,
        energy: p.energy,
        maxHp: p.maxHp,
        maxEnergy: p.maxEnergy,
        talents: [...p.talents],
        talentBonuses: { ...p.talentBonuses },
        skillLevels: { ...p.skillLevels },
        distance: p.distance
      },
      economy: {
        shopRefreshCount: this.scene.systemsRef.economy.shopRefreshCount,
        rerollCount: this.scene.systemsRef.economy.rerollCount
      },
      settings: {
        inputBindings: this.scene.systemsRef.input.getSnapshot()
      }
    };
  }

  save() {
    try {
      const data = this.buildSnapshot();
      localStorage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('[SaveSystem] Save failed', e);
      return false;
    }
  }

  load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return this.migrateIfNeeded(parsed);
    } catch (e) {
      console.warn('[SaveSystem] Corrupted save, backup ignored', e);
      return null;
    }
  }

  migrateIfNeeded(data) {
    if (!data.schema) {
      // v0 fallback
      return {
        schema: SAVE_SCHEMA_VERSION,
        runSeed: data.runSeed || Math.floor(Math.random() * 1e9),
        player: {
          level: data.level || 1,
          xp: data.xp || 0,
          gold: data.gold || 0,
          hp: data.hp || 100,
          energy: data.energy || 100,
          talents: data.talents || [],
          talentBonuses: data.talentBonuses || {},
          skillLevels: data.skillLevels || {
            ascendingRupture: 1, shadowStep: 1, flowBlade: 1, freezingPrism: 1, overloadCore: 1
          },
          distance: data.distance || 0
        },
        economy: { shopRefreshCount: 0, rerollCount: 0 },
        settings: { inputBindings: null }
      };
    }
    if (data.schema === 1) {
      data.schema = 2;
      data.economy = data.economy || { shopRefreshCount: 0, rerollCount: 0 };
      data.settings = data.settings || { inputBindings: null };
    }
    return data;
  }

  applySnapshot(snapshot) {
    if (!snapshot) return false;
    const p = this.scene.state.player;
    p.level = snapshot.player.level || 1;
    p.xp = snapshot.player.xp || 0;
    p.gold = snapshot.player.gold || 0;
    p.skillLevels = { ...p.skillLevels, ...(snapshot.player.skillLevels || {}) };
    p.talents = [...(snapshot.player.talents || [])];
    p.talentBonuses = { ...(snapshot.player.talentBonuses || {}) };
    p.recalcStats();
    p.hp = Math.min(p.maxHp, snapshot.player.hp || p.maxHp);
    p.energy = Math.min(p.maxEnergy, snapshot.player.energy || p.maxEnergy);
    p.distance = snapshot.player.distance || 0;

    const eco = this.scene.systemsRef.economy;
    eco.shopRefreshCount = snapshot.economy?.shopRefreshCount || 0;
    eco.rerollCount = snapshot.economy?.rerollCount || 0;

    if (snapshot.settings?.inputBindings) {
      this.scene.systemsRef.input.init(snapshot.settings.inputBindings);
    }
    return true;
  }

  update(now) {
    if (now >= this.nextAutoAt) {
      this.save();
      this.nextAutoAt = now + this.autosaveEveryMs;
    }
  }
}
