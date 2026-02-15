# QA Checklist (Verified)

## Core Loop (P0)
- [x] Game runs without crash for >20 mins.
- [x] Bosses spawn at milestones (2500px, 6000px).
- [x] Procedural generation is consistent (Seed: `12345`).
- [x] Falling off-map resets game (Kill Plane).

## Combat (P1)
- [x] Light Combo (1->2->3) works with timings.
- [x] Heavy Attack (Hold/Long Press simulation) works.
- [x] Damage pipeline centralized (Stats -> Crit -> Resist -> HP).
- [x] Status Effects (Burn/Freeze) apply tick damage and visual tint.
- [x] 5 Skills execute and consume energy correctly.

## Entities
- [x] Enemies follow FSM (Idle -> Chase -> Attack -> Evade).
- [x] Projectiles pool/recycle instead of destroy.
- [x] Minions and Elites spawn correctly.

## Systems Integration
- [x] Save/Load works (Persistence of Gold/Level/Seed).
- [x] Audio plays for Hit/Jump/Loot/Music.
- [x] Shop opens, deducts gold, grants talent.
- [x] Settings menu toggles Shake (mock).

## Performance
- [x] Chunk cleanup removes old platforms and enemies.
- [x] No `ReferenceError` or `TypeError` in console during loop.
