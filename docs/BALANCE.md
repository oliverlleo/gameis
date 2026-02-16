# BALANCE

## Base player stats (Lv1)
- HP: **180**
- Attack: **24**
- Energy: **100**
- Defense: **7.0**
- Crit chance: **8%**
- Crit multiplier: **1.70x** (base)
- Skill speed multiplier: **1.00**

## Level progression (Lv1–20)
| Lv | XP Next | HP | ATK | Energy | DEF | Crit % | Skill Speed |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 100 | 180 | 24 | 100 | 7 | 8.0 | 1.0 |
| 2 | 244 | 206 | 28 | 106 | 8.8 | 8.4 | 1.01 |
| 3 | 415 | 232 | 32 | 112 | 10.6 | 8.8 | 1.02 |
| 4 | 608 | 258 | 36 | 118 | 12.4 | 9.2 | 1.03 |
| 5 | 819 | 284 | 40 | 124 | 14.2 | 9.6 | 1.04 |
| 6 | 1046 | 310 | 44 | 130 | 16.0 | 10.0 | 1.05 |
| 7 | 1288 | 336 | 48 | 136 | 17.8 | 10.4 | 1.06 |
| 8 | 1544 | 362 | 52 | 142 | 19.6 | 10.8 | 1.07 |
| 9 | 1811 | 388 | 56 | 148 | 21.4 | 11.2 | 1.08 |
| 10 | 2091 | 414 | 60 | 154 | 23.2 | 11.6 | 1.09 |
| 11 | 2382 | 440 | 64 | 160 | 25.0 | 12.0 | 1.1 |
| 12 | 2683 | 466 | 68 | 166 | 26.8 | 12.4 | 1.11 |
| 13 | 2994 | 492 | 72 | 172 | 28.6 | 12.8 | 1.12 |
| 14 | 3314 | 518 | 76 | 178 | 30.4 | 13.2 | 1.13 |
| 15 | 3644 | 544 | 80 | 184 | 32.2 | 13.6 | 1.14 |
| 16 | 3983 | 570 | 84 | 190 | 34.0 | 14.0 | 1.15 |
| 17 | 4330 | 596 | 88 | 196 | 35.8 | 14.4 | 1.16 |
| 18 | 4685 | 622 | 92 | 202 | 37.6 | 14.8 | 1.17 |
| 19 | 5049 | 648 | 96 | 208 | 39.4 | 15.2 | 1.18 |
| 20 | 5420 | 674 | 100 | 214 | 41.2 | 15.6 | 1.19 |

XP formula: `XP_next = round(60 * level^1.45 + 40 * level)`.

## Enemy HP/Damage by tier (after scaling)
| Tier | HP Mult | DMG Mult | Speed Mult | Elite Chance |
|---:|---:|---:|---:|---:|
| 0 | 1.00x | 1.00x | 1.00x | 6% |
| 1 | 1.19x | 1.13x | 1.03x | 9% |
| 2 | 1.38x | 1.26x | 1.06x | 12% |
| 3 | 1.57x | 1.39x | 1.09x | 15% |
| 4 | 1.76x | 1.52x | 1.12x | 18% |

Base archetypes (tier 0):
- Melee HP 90 / DMG 14 / Speed 165
- Ranged HP 74 / DMG 12 / Speed 150
- Tank HP 140 / DMG 11 / Speed 110
- Support HP 70 / DMG 8 / Speed 135
- Summoner HP 92 / DMG 10 / Speed 125
- Assassin HP 82 / DMG 16 / Speed 185

## Boss stats
- Boss HP scaling: `baseHp * (1 + tier*0.25)`
- Boss DMG scaling: `baseDmg * (1 + tier*0.12)`
- Boss base resistances: Physical 22%, Arcane 18%, Elemental 20%
- Phase thresholds: 70% and 35% HP.
| Boss | Base HP | Base DMG | Phase 1 | Phase 2 modifier | Phase 3 modifier |
|---|---:|---:|---|---|---|
| A: Iron Tyrant | 2200 | 28 | pressure melee + telegraph slam | +adds summon cadence, +8% damage | +faster recover, anti-corner dash |
| B: Rift Matriarch | 2400 | 24 | ranged orb control | wider cone bursts, +freeze pressure | summon +execute beam windows |

## Skills (cost / cooldown / upgrades)
| Skill | Cost | Cooldown | Base effect | Upgrade L2 | Upgrade L3 |
|---|---:|---:|---|---|---|
| Ascending Rupture | 25 EN | 6.5s | vertical launcher, small i-frame | +12% vertical reach, +15% dmg vs statused | +25% crit dmg vs statused |
| Shadow Step | 20 EN | 5.0s | short intangible dash, cleanse slow | leaves afterimage (light dmg) | afterimage applies Shock 1.2s |
| Flow Blade | 30 EN | 8.0s | frontal multi-hit arc | +Bleed application chance 35% | bleed potency scales with combo (up to +40%) |
| Freezing Prism | 35 EN | 11.0s | projectile cone burst + partial Freeze | +slow potency | +full freeze chance on commons (22%) |
| Overload Core | 50 EN | 16.0s | mark then detonate burst + Shock | +radius/+dmg | execute bonus vs low HP targets (<=25%) |

## Status rules
- Burn: DoT 2.0s, base tick 5/s, max 4 stacks.
- Freeze: 35% slow (or short full freeze on proc), diminishing returns.
- Shock: +18% damage taken, optional chain proc.
- Bleed: DoT 3.0s, scales with combo and stack count.

## Loot rarities and probabilities
| Rarity | Weight | Effective drop chance |
|---|---:|---:|
| common | 54 | 54% |
| uncommon | 25 | 25% |
| rare | 13 | 13% |
| epic | 6 | 6% |
| legendary | 2 | 2% |

Total reward entries configured: **30**.

## Economy
- Gold per kill (base): 10–24
- XP per kill (base): 12–26
- Elite multipliers: Gold x2.2 / XP x2.0
- Boss multipliers: Gold x5.0 / XP x6.0

| Action | Cost rule |
|---|---:|
| Shop refresh | `30 * 1.22^n` |
| Heal 25% HP | 40 gold |
| Random talent | 65 gold |
| Skill upgrade | `70 * 1.35^n` |
| Passive reforge | 90 gold |
| Reroll offer | `45 * 1.28^n` |

## Pacing and risk/reward rationale
The curve combines moderate stat growth with encounter composition scaling (density + elites + hazards + behavior), avoiding bullet-sponge enemies. Director peak/breath windows keep tension rhythm, while merchant/risk events force meaningful tradeoffs between short-term survival and long-term build power.
