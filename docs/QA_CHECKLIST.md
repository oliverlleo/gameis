# QA Checklist (Final)

## Core Loop (P0)
- [x] Entity Lifecycle: Enemies active/alive states consistent.
- [x] EventBus: No duplication of events after restart (shutdown cleanup).
- [x] Boss Milestones: 2500px and 6000px spawns verified.
- [x] Chunk Cleanup: Enemies destroy when far from player.

## Combat (P1)
- [x] Combo: Light 1-2-3 implemented with timing.
- [x] Heavy Attack: Charge mechanic logic implemented.
- [x] I-Frames: Unified `isInvulnerable` flag.
- [x] Status System: Ticks and expires statuses correctly.

## Integration (P1)
- [x] Audio: SFX/Music synth connected to events.
- [x] Save/Load: Autosave and persistence functional.
- [x] UI: Cooldowns, Health, Gold, Settings accessible.
- [x] Shop: Validates gold and applies talents.

## Stability
- [x] No `ReferenceError` on EVENTS.
- [x] No `TypeError` on missing configs.
- [x] Asset Fallback: Guaranteed visible sprites even if 404.
