# Architecture

## Overview
This game is a 2D Infinite Side-Scroller Roguelite built on **Phaser 3**.
It uses a modular **ECS-like** (Entity-Component-System) structure but leverages Phaser's OOP features for Entities (Sprite extension).

## Directory Structure
- `/src/core`: Bootstrapping, Constants, Global Managers.
- `/src/entities`: Game Objects (Player, Enemy, Projectile) extending Phaser classes.
- `/src/systems`: Logic Managers (Input, Physics, Combat, AI) that operate on entities or global state.
- `/src/scenes`: Phaser Scene definitions (Boot, Menu, Game, UI).
- `/src/config`: Static configuration files (Physics, Balance, Biomes).
- `/src/utils`: Helpers (AssetGenerator, RNG).

## Key Systems

### 1. Procedural Generation (`ProceduralChunkSystem.js`)
- Generates infinite terrain in `2048px` chunks.
- Uses Mulberry32 deterministic RNG based on seed.
- Manages platform placement, gaps, and biome transitions.
- Dynamically loads/unloads chunks based on player X position.

### 2. Entity Management
- **Player**: FSM-based state machine (Idle, Run, Jump, Attack).
- **Enemies**: `EnemyBase` provides FSM. Subclasses (`EnemyMelee`, `EnemyRanged`, etc.) override `attack()` and `handleMovement()`.
- **Spawning**: `SpawnSystem` places enemies based on Biome rules and difficulty scaling.

### 3. Combat & Skills
- **Hit Detection**: Arcade Physics Overlap.
- **Damage**: `CombatSystem` handles damage calculation (Stats + Rarity), i-frames, and knockback.
- **Skills**: `SkillSystem` manages cooldowns, costs, and execution of the 5 active skills.
- **Status Effects**: `StatusSystem` handles DoT and CC (Burn, Freeze).

### 4. Progression (`ProgressionSystem.js`)
- XP Curve: `60 * level^1.45`.
- Stats: Linear growth per level.
- **Talents**: `TalentSystem` manages a passive tree with cross-synergies.
- **Loot**: `LootSystem` rolls rarity-weighted items from `lootTables.js`.

### 5. Asset Pipeline (`AssetGenerator.js`)
- **No External Assets**: All textures (sprites, tiles, particles) are generated procedurally at runtime using `Phaser.Graphics`.
- **Audio**: `AudioSystem` uses WebAudio API to synthesize SFX and Music procedurally.

## Design Decisions
- **Low Coupling**: Systems communicate via a global `EventBus`.
- **Performance**: Object pooling for Projectiles and Particles.
- **Scalability**: Config files allow easy tuning without code changes.
