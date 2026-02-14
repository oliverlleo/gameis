import { physicsConfig } from './physicsConfig.js';

export const gameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 1280,
  height: 720,
  backgroundColor: '#0b0f16',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: physicsConfig.gravity },
      debug: false
    }
  }
};
