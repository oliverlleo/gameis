# Architecture
Arcade Physics foi mantido por simplicidade, performance e determinismo no controle de plataforma com 60 FPS estáveis sem pipeline de build.

## Estrutura de jogo
- `MainScene` orquestra os sistemas: geração procedural, spawn, combate, skills, progressão, talentos, validação, UI, save e performance.
- Entidades são Phaser GameObjects com física Arcade aplicada (`scene.physics.add.existing`), evitando dependência de spritesheet para ser jogável localmente.
- Mundo infinito em chunks de 2048px com seed determinística salva em LocalStorage.

## Direção visual
- 4 biomas com paleta própria: Sunken Ruins, Night Forest, Ember Forge, Ethereal Cliffs.
- Camadas de fundo por chunk (BG + mid-layer + plataformas) para legibilidade de profundidade.
- Cores semânticas: jogador azul, inimigos normais vermelho/laranja, suporte roxo, assassino magenta, bosses destacados.

## Loop principal
- Avanço horizontal -> spawn contextual por distância -> combate corpo a corpo/skills -> ouro/XP -> level up/talentos -> bosses por milestones de distância.
- Director regula intensidade e dispara eventos raros para alternar ritmo (respiro/pico).
