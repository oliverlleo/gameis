import { GAME_WIDTH, GAME_HEIGHT } from '../core/Constants.js';
import { TALENTS } from '../systems/TalentSystem.js';
import eventBus from '../core/EventBus.js';

export default class ShopScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ShopScene', active: false });
    }

    create() {
        this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.8).setOrigin(0, 0);
        this.add.text(GAME_WIDTH/2, 50, 'MERCHANT', { fontSize: '48px', fill: '#ffd700' }).setOrigin(0.5);

        // List 3 random talents or consumables
        const available = TALENTS.slice(0, 3); // Pick random real in game logic

        let y = 200;
        available.forEach((talent, index) => {
            const cost = 100 * (index + 1);
            const btn = this.add.text(GAME_WIDTH/2, y, `${talent.name} - ${cost}g`, { fontSize: '32px', fill: '#ffffff' })
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true });

            btn.on('pointerdown', () => {
                eventBus.emit('buy-talent', { id: talent.id, cost: cost });
                btn.setText('SOLD').setInteractive(false).setColor('#555555');
            });

            this.add.text(GAME_WIDTH/2, y + 40, talent.desc, { fontSize: '16px', fill: '#aaaaaa' }).setOrigin(0.5);
            y += 120;
        });

        // Potion
        const potionBtn = this.add.text(GAME_WIDTH/2, y, 'Potion (Heal 50) - 50g', { fontSize: '32px', fill: '#00ff00' }).setOrigin(0.5).setInteractive();
        potionBtn.on('pointerdown', () => {
             eventBus.emit('buy-potion', { heal: 50, cost: 50 });
        });

        // Close
        const close = this.add.text(GAME_WIDTH/2, GAME_HEIGHT - 50, 'LEAVE', { fontSize: '32px', fill: '#ff0000' })
            .setOrigin(0.5).setInteractive();
        close.on('pointerdown', () => {
            this.scene.stop('ShopScene');
            this.scene.resume('GameScene');
        });
    }
}
