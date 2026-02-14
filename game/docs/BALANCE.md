# Balance Table

## Player Base Stats (Level 1)
- HP: 100
- Energy: 100
- Damage: 10 (Light Combo: 10 -> 12 -> 15)
- Defense: 0
- Speed: 260 px/s

## Progression (Per Level)
- HP: +10
- Energy: +5
- Damage: +2
- XP Required: `round(60 * level^1.45 + 40 * level)`
- Max Level: 50

## Economy
- Gold Drop: ~XP Value
- Item Drop Rate: 20%
- Rarity Weights: Common (60%), Uncommon (25%), Rare (10%), Epic (4%), Legendary (1%)

## Skills
| Skill | Cost | Cooldown | Damage | Effect |
| --- | --- | --- | --- | --- |
| Ascending Rupture | 25 | 6.5s | 20 | Launcher (-600px Y) |
| Shadow Step | 20 | 5.0s | 0 | Intangible Dash (300ms) |
| Flow Blade | 30 | 8.0s | 8x4 (32) | Multi-hit |
| Freezing Prism | 35 | 11.0s | 15 | Freeze (2s) |
| Overload Core | 50 | 16.0s | 80 | AoE Shock (Burst) |

## Enemies (Base Stats)
| Enemy | HP | Damage | Speed | Behavior |
| --- | --- | --- | --- | --- |
| Melee | 80 | 15 | 100 | Chase & Punch |
| Ranged | 40 | 10 | 100 | Flee & Shoot |
| Tank | 200 | 20 | 50 | Slow & Tough |
| Assassin | 40 | 30 | 150 | Teleport Backstab |
| Exploder | 30 | 50 | 150 | Kamikaze (AoE) |
| Bat | 20 | 5 | 200 | Flying Swarm |
| Boss A | 2000 | 25 | 120 | 3 Phases, Minions |
| Boss B | 3000 | 35 | Float | Teleport, Laser |
