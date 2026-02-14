import { SceneManager } from './SceneManager.js';
import { gameConfig } from '../config/gameConfig.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-root',
  width: gameConfig.width,
  height: gameConfig.height,
  backgroundColor: '#0b1020',
  pixelArt: true,
  physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
  scene: SceneManager.scenes,
};

window.__GAME__ = new Phaser.Game(config);
