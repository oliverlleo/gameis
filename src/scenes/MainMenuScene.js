import SaveSystem from '../systems/SaveSystem.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../core/Constants.js';

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('MainMenuScene');
        this.saveSystem = new SaveSystem();
    }

    create() {
        this.cameras.main.setBackgroundColor('#000000');
        
        // Title
        this.add.text(GAME_WIDTH/2, GAME_HEIGHT/4, 'INFINITE HORIZON', { fontSize: '64px', fill: '#00ffff', stroke: '#ffffff', strokeThickness: 2 }).setOrigin(0.5);

        // Buttons
        let startY = GAME_HEIGHT/2;
        
        const saveExists = this.saveSystem.load() !== null;
        
        if (saveExists) {
            this.createButton(GAME_WIDTH/2, startY, 'CONTINUE', () => {
                const data = this.saveSystem.load();
                this.scene.start('GameScene', { loadData: data });
            });
            startY += 80;
        }

        this.createButton(GAME_WIDTH/2, startY, 'NEW GAME', () => {
            this.saveSystem.clear();
            this.scene.start('GameScene', { loadData: null });
        });
        
        startY += 80;
        this.createButton(GAME_WIDTH/2, startY, 'SETTINGS', () => {
            console.log('Settings TODO');
            // Could launch SettingsScene overlay
        });
    }

    createButton(x, y, text, callback) {
        const txt = this.add.text(x, y, text, { fontSize: '32px', fill: '#ffffff' })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        txt.on('pointerover', () => txt.setStyle({ fill: '#ffff00' }));
        txt.on('pointerout', () => txt.setStyle({ fill: '#ffffff' }));
        txt.on('pointerdown', callback);
    }
}
