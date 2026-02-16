export const aiConfig = {
  detectRange: 620,
  attackRange: {
    melee: 68,
    ranged: 460,
    tank: 72,
    support: 420,
    summoner: 500,
    assassin: 85,
    boss: 190
  },
  disengageRange: 780,
  simultaneousAttackers: {
    frontlineMax: 3,
    backlineMax: 3
  },
  rethinkMs: 250,
  stuck: {
    timeMs: 900,
    minTravelDistance: 18
  },
  evade: {
    chance: 0.16,
    cooldownMs: 2400,
    distance: 120
  }
};
