export const biomeConfig = {
  order: ['ruins', 'night_forest', 'forge', 'ethereal_cliffs'],
  biomeBands: [
    { fromChunk: 0, toChunk: 11, biome: 'ruins' },
    { fromChunk: 12, toChunk: 23, biome: 'night_forest' },
    { fromChunk: 24, toChunk: 35, biome: 'forge' },
    { fromChunk: 36, toChunk: 99999, biome: 'ethereal_cliffs' }
  ],
  definitions: {
    ruins: {
      sky: 0x192237,
      fog: 0x314463,
      groundTop: 0x6a6f85,
      groundBody: 0x3d4355,
      platform: 0x8f96ab,
      parallax: [0x26324c, 0x1f2940, 0x182036],
      hazardChance: 0.08
    },
    night_forest: {
      sky: 0x0f1f1b,
      fog: 0x20453b,
      groundTop: 0x3f6e57,
      groundBody: 0x274838,
      platform: 0x6ba788,
      parallax: [0x1c3b30, 0x163228, 0x122820],
      hazardChance: 0.11
    },
    forge: {
      sky: 0x281611,
      fog: 0x5a2c1d,
      groundTop: 0x9a4b27,
      groundBody: 0x5e2a1a,
      platform: 0xd36c39,
      parallax: [0x6e2b18, 0x572213, 0x441a0f],
      hazardChance: 0.16
    },
    ethereal_cliffs: {
      sky: 0x171634,
      fog: 0x3a2f70,
      groundTop: 0x7674d8,
      groundBody: 0x454293,
      platform: 0x9fa3f9,
      parallax: [0x47458d, 0x3b3977, 0x2f2e62],
      hazardChance: 0.13
    }
  }
};
