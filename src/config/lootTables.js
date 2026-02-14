export const rarityWeights = { common: 54, uncommon: 25, rare: 13, epic: 6, legendary: 2 };
export const lootEntries = [
  ...Array.from({ length: 12 }, (_, i) => ({ id: `common_${i+1}`, rarity: 'common', effect: `+${2+i}% HP` })),
  ...Array.from({ length: 8 }, (_, i) => ({ id: `uncommon_${i+1}`, rarity: 'uncommon', effect: `+${3+i}% skill dmg` })),
  ...Array.from({ length: 5 }, (_, i) => ({ id: `rare_${i+1}`, rarity: 'rare', effect: `+${4+i}% crit` })),
  ...Array.from({ length: 3 }, (_, i) => ({ id: `epic_${i+1}`, rarity: 'epic', effect: `Trigger shock pulse ${i+1}` })),
  { id: 'legendary_1', rarity: 'legendary', effect: 'Execute below 16% HP' },
  { id: 'legendary_2', rarity: 'legendary', effect: 'Double-cast every 9th skill' },
];
