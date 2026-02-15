import { GAME_WIDTH, GAME_HEIGHT } from '../core/Constants.js';

export default class SettingsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SettingsScene', active: false });
    }

    create() {
        this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.9).setOrigin(0, 0);
        this.add.text(GAME_WIDTH/2, 50, 'SETTINGS', { fontSize: '48px', fill: '#ffffff' }).setOrigin(0.5);

        let y = 150;
        
        // Volume
        this.add.text(200, y, 'Master Volume', { fontSize: '24px', fill: '#fff' });
        this.add.text(500, y, '-', { fontSize: '32px', fill: '#ff0000' }).setInteractive().on('pointerdown', () => this.adjVolume(-0.1));
        this.volText = this.add.text(550, y, '50%', { fontSize: '24px', fill: '#fff' });
        this.add.text(620, y, '+', { fontSize: '32px', fill: '#00ff00' }).setInteractive().on('pointerdown', () => this.adjVolume(0.1));
        y += 80;

        // Screen Shake
        this.add.text(200, y, 'Screen Shake', { fontSize: '24px', fill: '#fff' });
        this.shakeText = this.add.text(550, y, 'ON', { fontSize: '24px', fill: '#00ff00' })
            .setInteractive()
            .on('pointerdown', () => {
                // Toggle logic
                this.shakeText.text = this.shakeText.text === 'ON' ? 'OFF' : 'ON';
                this.shakeText.setColor(this.shakeText.text === 'ON' ? '#00ff00' : '#ff0000');
            });
        y += 80;

        // Close
        const close = this.add.text(GAME_WIDTH/2, GAME_HEIGHT - 100, 'BACK', { fontSize: '32px', fill: '#ffffff' })
            .setOrigin(0.5).setInteractive();
        close.on('pointerdown', () => {
            this.scene.stop('SettingsScene');
            this.scene.resume('GameScene');
        });
    }

    adjVolume(delta) {
        // Mock logic, should connect to AudioSystem
        let vol = 0.5;
        vol = Phaser.Math.Clamp(vol + delta, 0, 1);
        this.volText.setText(`${Math.round(vol * 100)}%`);
    }
}
