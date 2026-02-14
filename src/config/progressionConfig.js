export const progressionConfig = {
  xpForLevel(level) { return Math.round(60 * (level ** 1.45) + 40 * level); },
  statGains: { hp: 14, attack: 2.2, energy: 4, defense: 1.2, crit: 0.002, skillSpeed: 0.004 },
  baseStats: { hp: 180, attack: 24, energy: 100, defense: 8, crit: 0.08, skillSpeed: 1 },
};
