export const combatConfig = {
  frameMs: 1000 / 60,
  combo: {
    resetWindowMs: 700,
    chain: [
      { key: 'light1', startupF: 6, activeF: 4, recoveryF: 10, damage: 24, knockback: 150, arc: { range: 88, angle: 55 } },
      { key: 'light2', startupF: 5, activeF: 4, recoveryF: 11, damage: 29, knockback: 168, arc: { range: 92, angle: 55 } },
      { key: 'light3', startupF: 7, activeF: 5, recoveryF: 14, damage: 36, knockback: 205, arc: { range: 98, angle: 62 } },
      { key: 'heavy', startupF: 12, activeF: 6, recoveryF: 20, damage: 58, knockback: 280, arc: { range: 124, angle: 72 } }
    ],
    cancel: {
      lightRecoveryFinalThirdCancelable: true,
      heavyCancelableOnlyLast10Percent: true
    }
  },
  crit: {
    baseChance: 0.08,
    baseMultiplier: 1.75
  },
  damageTypes: ['physical', 'arcane', 'elemental'],
  resistancesDefault: {
    physical: 0,
    arcane: 0,
    elemental: 0
  },
  statuses: {
    burn: { durationMs: 4200, tickMs: 500, maxStacks: 4, baseDot: 5 },
    freeze: { durationMs: 1200, slowPct: 0.45, fullFreezeChanceCommon: 0.2, drWindowMs: 6000 },
    shock: { durationMs: 3000, ampDamageTakenPct: 0.15, chainArc: 150, chainCount: 2 },
    bleed: { durationMs: 4600, tickMs: 400, maxStacks: 8, scalingPerCombo: 0.09 }
  },
  skills: {
    ascendingRupture: { energy: 25, cooldownMs: 6500, damage: 68, type: 'arcane', iFrameMs: 120 },
    shadowStep: { energy: 20, cooldownMs: 5000, damage: 24, type: 'physical' },
    flowBlade: { energy: 30, cooldownMs: 8000, hitCount: 4, hitDamage: 21, type: 'physical' },
    freezingPrism: { energy: 35, cooldownMs: 11000, impact: 42, explode: 35, type: 'elemental' },
    overloadCore: { energy: 50, cooldownMs: 16000, detonate: 110, type: 'arcane', executePct: 0.16 }
  }
};
