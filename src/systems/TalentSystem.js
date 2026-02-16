import { lootTables } from '../config/lootTables.js';

const TALENTS = [
  { id: 'ferro_core', rarity: 'common', stat: 'maxHp', value: 26 },
  { id: 'edge_memory', rarity: 'common', stat: 'attack', value: 4 },
  { id: 'energized_vein', rarity: 'common', stat: 'energyRegen', value: 2.4 },
  { id: 'impact_shell', rarity: 'common', stat: 'defense', value: 2.6 },
  { id: 'lucky_shard', rarity: 'common', stat: 'critChance', value: 0.014 },
  { id: 'swift_hands', rarity: 'common', stat: 'skillSpeed', value: 0.05 },
  { id: 'burn_arts', rarity: 'uncommon', stat: 'burnPower', value: 0.25 },
  { id: 'cryo_focus', rarity: 'uncommon', stat: 'freezePower', value: 0.23 },
  { id: 'shock_grid', rarity: 'uncommon', stat: 'shockPower', value: 0.25 },
  { id: 'hemorrhage_code', rarity: 'uncommon', stat: 'bleedPower', value: 0.25 },
  { id: 'kinetic_drive', rarity: 'uncommon', stat: 'moveSpeed', value: 25 },
  { id: 'battle_meditation', rarity: 'uncommon', stat: 'hpRegen', value: 1.2 },
  { id: 'execution_protocol', rarity: 'rare', stat: 'executeBonus', value: 0.07 },
  { id: 'arcane_surge', rarity: 'rare', stat: 'skillDamage', value: 0.18 },
  { id: 'duelist_instinct', rarity: 'rare', stat: 'critMultiplier', value: 0.28 },
  { id: 'bulwark_matrix', rarity: 'rare', stat: 'allRes', value: 0.08 },
  { id: 'combo_reactor', rarity: 'rare', stat: 'comboWindow', value: 170 },
  { id: 'energy_vamp', rarity: 'rare', stat: 'lifesteal', value: 0.05 },
  { id: 'frozen_cascade', rarity: 'epic', stat: 'synergy_freeze_shock', value: 1 },
  { id: 'scorched_wounds', rarity: 'epic', stat: 'synergy_burn_bleed', value: 1 },
  { id: 'echo_resonance', rarity: 'epic', stat: 'synergy_combo_skill', value: 1 },
  { id: 'guardian_overclock', rarity: 'epic', stat: 'synergy_defense_cast', value: 1 },
  { id: 'temporal_authority', rarity: 'legendary', stat: 'cooldownReduction', value: 0.12 },
  { id: 'eternal_predator', rarity: 'legendary', stat: 'synergy_execute_crit', value: 1 },
  { id: 'void_harmony', rarity: 'legendary', stat: 'synergy_arcane_energy', value: 1 },
  { id: 'phoenix_oath', rarity: 'legendary', stat: 'revive', value: 1 }
];

const SYNERGY_DESCRIPTIONS = {
  synergy_freeze_shock: 'Frozen Cascade: Shock deals +22% damage to Frozen targets and chains +1.',
  synergy_burn_bleed: 'Scorched Wounds: Burn ticks extend Bleed by +500ms.',
  synergy_combo_skill: 'Echo Resonance: each combo stage grants +3% skill damage, max 12%.',
  synergy_defense_cast: 'Guardian Overclock: on cast, gain 12% damage reduction for 2.5s.',
  synergy_execute_crit: 'Eternal Predator: crits below 30% enemy HP deal +45%.',
  synergy_arcane_energy: 'Void Harmony: arcane damage restores 2 energy per hit.',
  synergy_thunderlock: 'Thunderlock: Shocked enemies are 18% slower.',
  synergy_glacial_edge: 'Glacial Edge: hitting frozen enemies grants +10% crit chance for 3s.'
};

const RARITY_ORDER = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

export default class TalentSystem {
  constructor(scene) {
    this.scene = scene;
    this.pendingOffer = [];
    this.maxTalents = 24;
    this.revives = 0;
    this.unlockSynergyCount = 0;
  }

  init() {
    const p = this.scene.state.player;
    p.talents = [];
    p.talentBonuses = {};
  }

  grantRandomTalent(minRarity = 'common') {
    const p = this.scene.state.player;
    if (p.talents.length >= this.maxTalents) {
      this.scene.systemsRef.ui.toast('Talent cap reached');
      return null;
    }
    const minIndex = RARITY_ORDER.indexOf(minRarity);
    const pool = TALENTS.filter(t => RARITY_ORDER.indexOf(t.rarity) >= Math.max(0, minIndex) && !p.talents.includes(t.id));
    if (!pool.length) return null;
    const pick = Phaser.Utils.Array.GetRandom(pool);
    this.applyTalent(pick);
    return pick;
  }

  applyTalent(talent) {
    const p = this.scene.state.player;
    if (p.talents.includes(talent.id)) return false;
    p.talents.push(talent.id);

    if (talent.stat.startsWith('synergy_')) {
      p.talentBonuses[talent.stat] = 1;
      this.unlockSynergyCount += 1;
      this.scene.systemsRef.ui.toast(SYNERGY_DESCRIPTIONS[talent.stat] || talent.id);
    } else if (talent.stat === 'allRes') {
      p.talentBonuses.allRes = (p.talentBonuses.allRes || 0) + talent.value;
    } else {
      p.talentBonuses[talent.stat] = (p.talentBonuses[talent.stat] || 0) + talent.value;
    }

    if (talent.stat === 'revive') this.revives += talent.value;

    p.recalcStats();
    return true;
  }

  applyLootItem(item) {
    const p = this.scene.state.player;
    if (item.stat === 'allRes') {
      p.talentBonuses.allRes = (p.talentBonuses.allRes || 0) + item.value;
    } else {
      p.talentBonuses[item.stat] = (p.talentBonuses[item.stat] || 0) + item.value;
    }
    p.recalcStats();
  }

  onLevelUp(level) {
    // give talent at levels 2,5,8...
    if ((level - 2) % 3 === 0) {
      this.grantRandomTalent(level > 15 ? 'rare' : level > 8 ? 'uncommon' : 'common');
    }
  }

  reforgeOneTalent() {
    const p = this.scene.state.player;
    if (!p.talents.length) return false;
    const index = Phaser.Math.Between(0, p.talents.length - 1);
    const removedId = p.talents.splice(index, 1)[0];
    this.recomputeBonuses();
    const min = removedId.includes('legendary') ? 'rare' : 'common';
    this.grantRandomTalent(min);
    return true;
  }

  offerReroll() {
    this.pendingOffer = [this.randomFromRarity('uncommon'), this.randomFromRarity('rare')].filter(Boolean);
    return this.pendingOffer;
  }

  pickOffer(index = 0) {
    const item = this.pendingOffer[index];
    if (!item) return false;
    this.applyTalent(item);
    this.pendingOffer = [];
    return true;
  }

  randomFromRarity(rarity) {
    const p = this.scene.state.player;
    const pool = TALENTS.filter(t => t.rarity === rarity && !p.talents.includes(t.id));
    if (!pool.length) return null;
    return Phaser.Utils.Array.GetRandom(pool);
  }

  recomputeBonuses() {
    const p = this.scene.state.player;
    p.talentBonuses = {};
    this.revives = 0;
    for (const id of p.talents) {
      const t = TALENTS.find((x) => x.id === id);
      if (!t) continue;
      if (t.stat.startsWith('synergy_')) p.talentBonuses[t.stat] = 1;
      else p.talentBonuses[t.stat] = (p.talentBonuses[t.stat] || 0) + t.value;
      if (t.stat === 'revive') this.revives += t.value;
    }
    p.recalcStats();
  }

  update() {
    // runtime synergy hooks
    const p = this.scene.state.player;
    if (!p?.active) return;
    // sample passive effect: guardian_overclock duration handling
    if (p.guardianOverclockUntil && performance.now() >= p.guardianOverclockUntil) {
      p.guardianOverclockUntil = 0;
    }
  }

  getAllTalentDefinitions() {
    return TALENTS;
  }
}
