export const combatConfig = {
  combo: [
    { name: 'light1', startup: 6, active: 4, recovery: 10, damage: 18, hitstop: 'light' },
    { name: 'light2', startup: 5, active: 4, recovery: 11, damage: 22, hitstop: 'light' },
    { name: 'light3', startup: 7, active: 5, recovery: 14, damage: 29, hitstop: 'light' },
    { name: 'heavy', startup: 12, active: 6, recovery: 20, damage: 50, hitstop: 'heavy' },
  ],
  critChance: 0.08,
  critMultiplier: 1.7,
  skillData: {
    ascendingRupture: { cost: 25, cooldown: 6500, damage: 75 },
    shadowStep: { cost: 20, cooldown: 5000, damage: 20 },
    flowBlade: { cost: 30, cooldown: 8000, damage: 90 },
    freezingPrism: { cost: 35, cooldown: 11000, damage: 70 },
    overloadCore: { cost: 50, cooldown: 16000, damage: 150 },
  },
  statuses: {
    burn: { durationMs: 3800, tickMs: 450, maxStacks: 4, dot: 5 },
    freeze: { durationMs: 1200, slow: 0.45, drMultiplier: 0.65 },
    shock: { durationMs: 2500, bonusTaken: 0.12, chainDamage: 14 },
    bleed: { durationMs: 3000, tickMs: 350, maxStacks: 6, base: 3 },
  },
};
