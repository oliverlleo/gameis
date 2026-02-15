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

        // Get Player Gold from EconomySystem (via GameScene or event?)
        // Best to access global state or pass data.
        const gold = this.scene.get('GameScene').economySystem.gold;
        this.goldText = this.add.text(GAME_WIDTH/2, 100, `Gold: ${gold}`, { fontSize: '24px', fill: '#ffd700' }).setOrigin(0.5);

        // Get available talents
        const talentSystem = this.scene.get('GameScene').talentSystem;
        const available = talentSystem.getAvailable().slice(0, 3);

        let y = 200;
        available.forEach((talent, index) => {
            const cost = 100 * (index + 1); // Simple cost scaling
            const btn = this.add.text(GAME_WIDTH/2, y, `${talent.name} - ${cost}g`, { fontSize: '32px', fill: '#ffffff' })
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true });

            btn.on('pointerdown', () => {
                const currentGold = this.scene.get('GameScene').economySystem.gold;
                if (currentGold >= cost) {
                    // Transaction
                    this.scene.get('GameScene').economySystem.spendGold(cost);
                    talentSystem.acquire(talent.id);

                    // UI Update
                    btn.setText('PURCHASED').setInteractive(false).setColor('#00ff00');
                    this.goldText.setText(`Gold: ${currentGold - cost}`);
                    eventBus.emit('play-sound', 'ui'); // Assuming UI sound listener exists or adding it
                } else {
                    btn.setColor('#ff0000');
                    this.time.delayedCall(200, () => btn.setColor('#ffffff'));
                }
            });

            this.add.text(GAME_WIDTH/2, y + 40, talent.desc, { fontSize: '16px', fill: '#aaaaaa' }).setOrigin(0.5);
            y += 120;
        });

        // Potion
        const potionCost = 50;
        const potionBtn = this.add.text(GAME_WIDTH/2, y, `Potion (Heal 50) - ${potionCost}g`, { fontSize: '32px', fill: '#00ff00' }).setOrigin(0.5).setInteractive();
        potionBtn.on('pointerdown', () => {
             const currentGold = this.scene.get('GameScene').economySystem.gold;
             if (currentGold >= potionCost) {
                 this.scene.get('GameScene').economySystem.spendGold(potionCost);
                 // Apply Heal
                 const player = this.scene.get('GameScene').player;
                 player.stats.hp = Math.min(player.stats.maxHp, player.stats.hp + 50);
                 eventBus.emit('player-healed', { hp: player.stats.hp, maxHp: player.stats.maxHp });

                 this.goldText.setText(`Gold: ${currentGold - potionCost}`);
             }
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
