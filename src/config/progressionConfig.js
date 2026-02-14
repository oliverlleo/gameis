export const PROGRESSION_CONFIG = {
    maxLevel: 50,
    getXPForLevel: (level) => Math.round(60 * Math.pow(level, 1.45) + 40 * level),
    statGrowth: {
        hp: 10,
        energy: 5,
        damage: 2,
        defense: 1
    },
    // Rarity weights
    loot: {
        common: 60,
        uncommon: 25,
        rare: 10,
        epic: 4,
        legendary: 1
    }
};
