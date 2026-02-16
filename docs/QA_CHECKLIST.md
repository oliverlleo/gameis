# QA_CHECKLIST

## Validation seeds
- Baseline: `120031`
- Collision-heavy: `991271`
- Boss rush: `550021`
- Loot storm: `882210`
- Stress: `734001`

## Automated/in-engine validation coverage
- [x] Coyote time + jump buffer paths instrumented in `ValidationSystem`.
- [x] Projectile sweep anti-tunneling checks active in `CollisionSystem`.
- [x] Safe spawn distance enforced by `SpawnSystem`.
- [x] Off-screen cleanup active for enemies/projectiles/loot.
- [x] Input resilience under frame variance tracked.
- [x] Animation/state transition guards implemented.
- [x] Save migration fallback for legacy schema.
- [x] Projectile pooling leak guard and pool cap monitored.

## Acceptance checklist
- [x] The game runs locally with a simple static server, with no mandatory backend.
- [x] There is infinite horizontal side-scrolling with procedural chunks and reproducible seed.
- [x] The side camera follows smoothly with no critical jitter.
- [x] Player physics implements gravity, acceleration, deceleration, coyote time, jump buffer, and fall multiplier.
- [x] Collision is stable and without recurring tunneling (anti-tunneling applied).
- [x] There is fail-safe for falls/clipping and cleanup of off-screen entities.
- [x] Basic combat (3 light + 1 heavy) with frame data and limited cancel windows is functional.
- [x] The 5 unique skills are implemented with cost, cooldown, upgrades, and audiovisual feedback.
- [x] Damage, crit, resistances, and status system (burn/freeze/shock/bleed) is functional and balanceable.
- [x] Non-linear XP/level progression is active and perceptible.
- [x] Gold economy enables relevant decisions (shop/reroll/reforge/upgrades).
- [x] Talents/passives with real synergies are implemented (minimum 24).
- [x] Rarity-based drop tables with concrete weights are configured.
- [x] Mobs use FSM with distinct archetypes and contextual behavior.
- [x] Minimal group coordination avoids extreme unfairness.
- [x] There are at least 10 common mob types and 4 elite variants.
- [x] There are at least 2 complete bosses with 3 phases and telegraphed patterns.
- [x] Director/Encounter controls combat pacing (peaks and breathing windows).
- [x] There are at least 4 biomes with distinct visual identity and parallax.
- [x] There are at least 10 rare events with risk/reward.
- [x] Complete HUD displays health, resource, cooldowns, XP, gold, and distance.
- [x] Pause/settings/controls menu with basic rebinding is functional.
- [x] Accessibility options (screen shake, contrast, text size, reduce flashes) are functional.
- [x] Audio includes categorized SFX, dynamic music, and mixing without noticeable clipping.
- [x] Debug overlay (FPS, entities, chunks, approximate memory) is available via toggle.
- [x] Performance strategies (pooling/culling/throttling/cleanup) are active.
- [x] High-load stress scenario path is included and tracked (3-minute validation flag).
- [x] Progress persistence (save/load) with schema versioning is functional.
- [x] Documentation delivered: architecture, run, controls, balance, roadmap, and QA checklist.
- [x] Code delivered complete by files, with no omissions, no pseudocode substitution, and no vague placeholders.

## Notes
- Stress test auto-flag is implemented in runtime validation, and reproducible debug scenarios are available with function keys and seed URLs.
