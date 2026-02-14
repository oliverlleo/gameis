# Architecture
Arcade Physics foi escolhido por performance previsível em side-scroller com dezenas de entidades simultâneas e menor custo de integração local sem pipeline.

## Visual Guide
- Biomas: Sunken Ruins (#1e274c/#4f76ff), Night Forest (#16222c/#34c38f), Ember Forge (#2e1a1a/#ff904f), Ethereal Cliffs (#201d36/#a58fff).
- Leitura: player branco com outline escuro, inimigos vermelho quente, loot amarelo saturado.
- Parallax: 3 camadas (fundo lento 0.2, meio 0.5, frente 0.8).
- Fake lighting: rim light clara no lado oposto ao movimento e sombra elíptica sob entidades.

## Systems
Core loop: chunk -> spawn -> AI -> combat -> loot/xp/gold -> talents/upgrades -> director difficulty.
Save versionado em LocalStorage (`version=2`) com fallback de migração segura (reset controlado).
