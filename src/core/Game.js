import BootScene from '../scenes/BootScene.js';
import MainMenuScene from '../scenes/MainMenuScene.js';
import GameScene from '../scenes/GameScene.js';
import UIScene from '../scenes/UIScene.js';
import GameOverScene from '../scenes/GameOverScene.js';
import ShopScene from '../scenes/ShopScene.js';
import { GAME_WIDTH, GAME_HEIGHT, GRAVITY } from './Constants.js';

// Game Configuration
const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#0d0d0d',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: GRAVITY },
            debug: false // Can toggle with F3 later
        }
    },
    scene: [
        BootScene,
        MainMenuScene,
        GameScene,
        UIScene,
        GameOverScene,
        ShopScene
    ],
    fps: {
        target: 60,
        forceSetTimeOut: true
    }
};

// Initialize Game
const game = new Phaser.Game(config);

// Expose game instance for debug/dev (optional)
window.game = game;

export default game;
