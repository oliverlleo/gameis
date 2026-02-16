export const progressionConfig = {
  levelCap: 50,
  xpFormula(level) {
    return Math.round(60 * Math.pow(level, 1.45) + 40 * level);
  },
  basePlayerStats: {
    maxHp: 240,
    hpRegenPerSec: 1.8,
    maxEnergy: 120,
    energyRegenPerSec: 14,
    attack: 26,
    defense: 12,
    critChance: 0.08,
    critMultiplier: 1.75,
    skillSpeed: 1.0
  },
  perLevelGains: {
    maxHp: 18,
    attack: 2.4,
    maxEnergy: 4.2,
    defense: 0.8,
    critChance: 0.002,
    skillSpeed: 0.005
  },
  metaprogression: {
    startingRerollSlots: 1,
    unlocks: [
      { id: 'meta_class_arcane', cost: 1600, label: 'Arcane Class Perk' },
      { id: 'meta_extra_event', cost: 2200, label: 'Extra Rare Event Pool' },
      { id: 'meta_reroll_slot_2', cost: 1800, label: 'Second Reroll Slot' },
      { id: 'meta_reroll_slot_3', cost: 3600, label: 'Third Reroll Slot' }
    ]
  }
};
