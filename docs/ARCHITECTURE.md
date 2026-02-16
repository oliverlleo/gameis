# ARCHITECTURE

## Technical summary
- **Engine:** Phaser 3.90 (Arcade Physics).
- **Physics model:** Arcade chosen for deterministic 2D side-scroller responsiveness, lower integration complexity, and easier fixed-feel tuning for jump/coyote/buffer/hitstop loops.
- **Audio:** WebAudio mixer implemented in `AudioSystem` (master/music/sfx/ui buses), dynamic music state (exploration/combat/boss), ducking on high-impact moments.
- **Persistence:** LocalStorage with schema versioning and migration fallback (`SaveSystem`).
- **World:** infinite procedural chunks (`2048 px`) with deterministic seed (`RNG`), chunk streaming (2 behind / 4 ahead), unload + cleanup.
- **Gameplay:** run-based endless progression with optional continuity via save, XP/gold economy, talent synergies, rare events, elites, bosses.

## Module responsibilities

### Core
- `Game.js`: bootstraps scene, systems wiring, groups, game loop ordering.
- `SceneManager.js`: scene control wrapper.
- `Time.js`: deterministic delta helper.
- `EventBus.js`: decoupled event broadcast.
- `RNG.js`: seeded deterministic PRNG and hash combinators.
- `Constants.js`: event IDs, layers, schema version, damage/status enums.

### Entities
- `Player.js`: movement state, combo, cooldowns, energy/hp, status container, stat recalculation.
- `EnemyBase.js`: shared FSM, attack gates, status logic, knockback/hitstun.
- `Enemy*`: archetype-specific behavior (melee/ranged/tank/support/summoner/assassin).
- `EliteVariants.js`: aura/shield/reflect/spawn mutators.
- `BossA.js`, `BossB.js`: 3-phase boss logic, telegraphs, anti-cheese reactions.
- `Projectile.js`: pooled projectile actor with typed payload.
- `LootOrb.js`: pooled pickup physics + magnet behavior.

### Systems
- `InputSystem`: keyboard mapping + runtime rebinding.
- `MovementSystem`: acceleration/deceleration, coyote/buffer, jump-cut/fall multipliers, fail-safe respawn.
- `CollisionSystem`: colliders, overlaps, projectile sweep anti-tunneling.
- `CombatSystem`: frame-data combo timing, cancel windows, crit/resistance/status damage.
- `SkillSystem`: Q/W/E/R/F skills, costs, cooldowns, upgrade scaling, VFX/audio hooks.
- `StatusSystem`: burn/freeze/shock/bleed application and runtime modifiers.
- `AISystem`: enemy decision updates + simultaneous attacker caps.
- `DirectorSystem`: pacing controller with peak/breath windows and intensity curve.
- `SpawnSystem`: context-aware pack spawning, elites, bosses, rare event resolution.
- `ProceduralChunkSystem`: chunk generation, biome selection, platform reachability, hazard placement.
- `LootSystem`: XP/gold/item drops, rarity roll table.
- `ProgressionSystem`: XP curve and level-up stat growth.
- `EconomySystem`: merchant costs, reroll scaling, skill upgrades, reforge.
- `TalentSystem`: 24+ passives, explicit synergy flags, level-up grants, reroll/reforge.
- `UISystem`: HUD, pause/settings, shop menu, accessibility controls.
- `AudioSystem`: buses, dynamic state changes, ducking, impact cues.
- `SaveSystem`: load/save/migrate/autosave.
- `VFXSystem`: hit spark, slash arc, explosions, telegraphs, shake.
- `CameraSystem`: smooth follow + parallax shift.
- `PerformanceSystem`: pooling, off-screen cleanup, metrics.
- `ValidationSystem`: in-engine automated validations and stress flagging.

### Debug
- `DebugOverlay.js`: F3 live telemetry (fps/frame/chunks/entities/memory).
- `DebugCommands.js`: F5/F6/F7/F8 debug actions.
- `TestScenarios.js`: reproducible seeds/scenarios.

## Biome art direction
- **Ruins:** broken stone palette, muted blues/gray, low hazard baseline.
- **Night Forest:** green/teal depth layers, denser encounters.
- **Forge:** orange/red industrial glow, elevated hazard chance.
- **Ethereal Cliffs:** violet/cyan high-contrast skyline, advanced jumps.

## Physics values
- Tick target: 60 FPS.
- Gravity: 2200 px/s².
- Max horizontal speed: 260 px/s.
- Acceleration: 2400 px/s².
- Braking: 3000 px/s².
- Jump: -760 px/s, coyote 120 ms, jump buffer 110 ms, jump-cut 2.1x gravity, fall multiplier 1.85, max fall 1200.
- i-frames: 350 ms.
- Hitstop: light 35 ms, heavy/impact 60–85 ms.
- Hitstun: mobs 120 ms, elites 80 ms, bosses 40 ms.
- Fail-safe: out-of-world reposition with hp penalty + cleanup/pooling.
