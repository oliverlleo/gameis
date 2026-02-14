export const progressionConfig = {
  levelCap: 50,
  xpForLevel: (level) => Math.round(60 * Math.pow(level, 1.45) + 40 * level),
  baseStats: { hp: 220, atk: 20, energy: 100, defense: 10, crit: 0.12, skillHaste: 0 },
  gainPerLevel: { hp: 18, atk: 3.1, energy: 4, defense: 1.2, crit: 0.002, skillHaste: 0.003 },
  metaUnlocks: ['newEventPool', 'extraReroll', 'classGlyph']
};
