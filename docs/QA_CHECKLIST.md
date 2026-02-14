# QA Checklist

## Core Loop
- [x] Game runs locally via `python -m http.server`.
- [x] Infinite horizontal scrolling active.
- [x] Procedural chunk generation (2048px segments).
- [x] Biome transitions every 5 chunks.
- [x] Player Movement (Run, Jump, Fall, Coyote Time).

## Combat
- [x] Light Attack Combo (3 hits).
- [x] Heavy Attack (Hold/Charge logic implied).
- [x] 5 Skills Implemented (Ascending Rupture, Shadow Step, Flow Blade, Freezing Prism, Overload Core).
- [x] Damage numbers appear on hit.
- [x] I-frames on player damage.
- [x] Knockback physics.

## Entities
- [x] Enemy Base FSM (Idle -> Chase -> Attack).
- [x] 10 Enemy Types (Melee, Ranged, Tank, Support, Assassin, Exploder, Shield, Ghost, Bat, Slime).
- [x] Boss A (3 Phases, Minions).
- [x] Boss B (Teleport, Laser).
- [x] Elite enemy spawning (Yellow tint, increased stats).

## Progression
- [x] XP Gain & Level Up (Stats increase).
- [x] Gold pickup & Economy (LootOrb).
- [x] Talent System (24 Passives defined).
- [x] Loot Drops (30 items defined).

## UI/UX
- [x] HUD (HP, Energy, XP, Gold).
- [x] Main Menu (Start, Continue).
- [x] Game Over Screen (Restart).
- [x] Save/Load System (LocalStorage).
- [x] Debug Overlay (F3).

## Audio/Visual
- [x] Procedural Asset Generation (Player, Enemies, Tiles).
- [x] Procedural Audio (WebAudio Synth for SFX).
- [x] Camera Follow & Shake.
- [x] Particle Effects (Loot, Hit).

## Stability
- [x] No crash on startup.
- [x] Error handling in SaveSystem.
- [x] Object pooling for Projectiles.
