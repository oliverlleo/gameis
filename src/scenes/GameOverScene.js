import { GAME_WIDTH, GAME_HEIGHT } from '../core/Constants.js';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    create() {
        this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.7).setOrigin(0, 0);

        this.add.text(GAME_WIDTH/2, GAME_HEIGHT/3, 'YOU DIED', { fontSize: '64px', fill: '#ff0000' }).setOrigin(0.5);

        const restart = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2, 'RESTART', { fontSize: '32px', fill: '#ffffff' })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        restart.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        const menu = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 60, 'MAIN MENU', { fontSize: '32px', fill: '#ffffff' })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        menu.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    }
}
