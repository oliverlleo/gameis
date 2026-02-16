export const physicsConfig = {
  targetTick: 60,
  gravity: 2200,
  maxHorizontalSpeed: 260,
  acceleration: 2400,
  braking: 3000,
  stopInMs: 180,
  jump: {
    velocity: -760,
    usableHeightRange: [120, 140],
    coyoteMs: 120,
    bufferMs: 110,
    jumpCutGravityMultiplier: 2.1,
    fallMultiplier: 1.85,
    maxFallSpeed: 1200
  },
  collision: {
    minProjectileSubsteps: 2,
    maxProjectileSubsteps: 5,
    layerMask: {
      player: 1,
      ground: 2,
      platform: 4,
      enemy: 8,
      projectile: 16,
      loot: 32
    }
  },
  player: {
    invulnMs: 350,
    contactDamageCooldownMs: 600,
    knockbackClampX: 420,
    knockbackClampY: 560
  },
  combatFeel: {
    hitstopLightMs: 35,
    hitstopHeavyMs: 75,
    hitstun: {
      common: 120,
      elite: 80,
      boss: 40
    }
  },
  cleanup: {
    offscreenDistance: 1800
  }
};
