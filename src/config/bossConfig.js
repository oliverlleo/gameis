export const bossConfig = {
  bosses: {
    bossA: {
      id: 'Abyss Warden',
      baseHp: 4200,
      baseDmg: 36,
      speed: 92,
      resistances: { physical: 0.1, arcane: 0.2, elemental: 0.05 },
      phases: [
        { hpPct: 1.0, moves: ['slash', 'slam', 'blink'] },
        { hpPct: 0.7, moves: ['slam', 'orb_barrage', 'summon'] },
        { hpPct: 0.35, moves: ['blink', 'orb_barrage', 'cataclysm'] }
      ]
    },
    bossB: {
      id: 'Forge Tyrant',
      baseHp: 5100,
      baseDmg: 40,
      speed: 76,
      resistances: { physical: 0.25, arcane: 0.08, elemental: 0.12 },
      phases: [
        { hpPct: 1.0, moves: ['cleave', 'charge', 'lava_pool'] },
        { hpPct: 0.7, moves: ['charge', 'molten_wave', 'summon_turrets'] },
        { hpPct: 0.35, moves: ['meteor', 'molten_wave', 'overheat'] }
      ]
    }
  },
  antiCheese: {
    stunChainResistGain: 0.15,
    maxCornerLockSeconds: 2.2,
    repetitiveSkillCounterWindowMs: 6000
  }
};
