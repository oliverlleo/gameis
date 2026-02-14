import { gameConfig } from '../config/gameConfig.js';
import { sceneList } from './SceneManager.js';

const game = new Phaser.Game({ ...gameConfig, scene: sceneList });
window.__GAME__ = game;
