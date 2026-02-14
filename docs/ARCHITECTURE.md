# Architecture
Arcade Physics was chosen for deterministic platforming and lightweight collision at 60 FPS without a build pipeline.

## Visual Guide
- Biome palettes: Sunken Ruins (#1f2f46/#38567a/#9bc7d4), Night Forest (#102114/#274d2c/#7bc47f), Ember Forge (#36120d/#7a2a1f/#f07d3c), Ethereal Cliffs (#20203d/#5555aa/#b5bdff).
- Multi-layer parallax speeds configured per biome.
- Silhouette readability: player cyan, enemies red, elites purple, bosses orange.
- Fake rim light via top highlight particles and low-opacity fake shadow ellipses.

## Systems
Core loop orchestrated by MainScene with modular systems for chunks, spawning, combat, skills, progression, save, UI, performance, and director pacing.
