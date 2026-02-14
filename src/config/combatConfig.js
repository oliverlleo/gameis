export const combatConfig = {
  frameData: {
    light1: { startup: 6, active: 4, recovery: 10, dmg: 18 },
    light2: { startup: 5, active: 4, recovery: 11, dmg: 22 },
    light3: { startup: 7, active: 5, recovery: 14, dmg: 30 },
    heavy: { startup: 12, active: 6, recovery: 20, dmg: 52 }
  },
  crit: { chance: 0.12, multi: 1.7 },
  damageTypes: ['physical', 'arcane', 'elemental'],
  statuses: {
    burn: { duration: 3, tick: 0.5, stackMax: 3, dot: 8 },
    freeze: { duration: 1.2, slow: 0.55, fullFreezeChance: 0.15, drWindow: 6 },
    shock: { duration: 2.1, vuln: 0.15, chainDamage: 12 },
    bleed: { duration: 4, tick: 0.5, comboScale: 0.06 }
  },
  skills: {
    ascendingRupture: { cost: 25, cd: 6.5, baseDamage: 64 },
    shadowStep: { cost: 20, cd: 5, baseDamage: 16 },
    flowBlade: { cost: 30, cd: 8, baseDamage: 22, hits: 4 },
    freezingPrism: { cost: 35, cd: 11, baseDamage: 42 },
    overloadCore: { cost: 50, cd: 16, baseDamage: 120, executePct: 0.18 }
  }
};
