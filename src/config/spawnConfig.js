export const spawnConfig = {
  safeSpawnDistanceFromPlayer: 280,
  minSpawnDistanceAhead: 340,
  maxSpawnDistanceAhead: 1150,
  zoneCooldownMs: 2400,
  baseDensityByTier: [0.75, 0.95, 1.15, 1.4, 1.7],
  eliteChanceByTier: [0.04, 0.07, 0.1, 0.14, 0.19],
  bossDistanceThresholds: [6000, 12000, 18500, 26000],
  enemyTypes: [
    { id: 'scrap_raider', classKey: 'melee', tierBias: 0, hp: 88, dmg: 16, speed: 145 },
    { id: 'thorn_stalker', classKey: 'assassin', tierBias: 0, hp: 78, dmg: 18, speed: 200 },
    { id: 'iron_mauler', classKey: 'tank', tierBias: 1, hp: 155, dmg: 20, speed: 86 },
    { id: 'gloom_archer', classKey: 'ranged', tierBias: 0, hp: 92, dmg: 17, speed: 118 },
    { id: 'ember_channeler', classKey: 'support', tierBias: 1, hp: 96, dmg: 12, speed: 100 },
    { id: 'void_conjurer', classKey: 'summoner', tierBias: 2, hp: 104, dmg: 13, speed: 95 },
    { id: 'rift_lancer', classKey: 'melee', tierBias: 1, hp: 128, dmg: 23, speed: 158 },
    { id: 'frost_slinger', classKey: 'ranged', tierBias: 2, hp: 122, dmg: 26, speed: 108 },
    { id: 'bastion_guard', classKey: 'tank', tierBias: 2, hp: 198, dmg: 24, speed: 78 },
    { id: 'shade_executor', classKey: 'assassin', tierBias: 3, hp: 136, dmg: 32, speed: 228 }
  ],
  eliteVariants: [
    { id: 'aura_overseer', hpMult: 1.35, dmgMult: 1.25, mutator: 'aura' },
    { id: 'bulwark_shell', hpMult: 1.6, dmgMult: 1.1, mutator: 'shield' },
    { id: 'reflector_spine', hpMult: 1.25, dmgMult: 1.3, mutator: 'reflect' },
    { id: 'brood_summoner', hpMult: 1.4, dmgMult: 1.15, mutator: 'spawnlings' }
  ],
  rareEvents: [
    'merchant',
    'risk_altar',
    'cursed_chest',
    'arena_lock',
    'healing_sanctuary',
    'roaming_miniboss',
    'loot_storm',
    'time_distortion',
    'blessing_shrine',
    'echo_cache'
  ]
};
