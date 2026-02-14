import { COMBAT_CONFIG } from '../config/combatConfig.js';
import eventBus from '../core/EventBus.js';

export default class DirectorSystem {
    constructor(scene) {
        this.scene = scene;
        this.difficulty = 1;
        this.timer = 0;
        this.eventTimer = 0;
        this.eventInterval = 30000; // Check event every 30s
    }

    update(time, delta) {
        this.timer += delta;
        this.difficulty = 1 + (this.timer / 60000);

        this.eventTimer += delta;
        if (this.eventTimer > this.eventInterval) {
            this.eventTimer = 0;
            this.trySpawnEvent();
        }
    }

    trySpawnEvent() {
        const x = this.scene.player.sprite.x + 800; // Spawn ahead
        const y = this.scene.game.config.height - 100;

        const roll = Math.random();
        if (roll < 0.3) {
            // Spawn Merchant
            this.spawnMerchant(x, y);
        } else if (roll < 0.6) {
            // Spawn Chest
            this.spawnChest(x, y);
        } else if (roll < 0.8) {
            // Spawn Altar
            this.spawnAltar(x, y);
        } else {
            // Spawn Mini-Boss or Elite Pack?
            // Already handled by spawn system partially.
        }
    }

    spawnMerchant(x, y) {
        const merchant = this.scene.physics.add.sprite(x, y, 'particle_white').setTint(0xffd700).setScale(2);
        merchant.body.setAllowGravity(false);
        merchant.body.immovable = true;
        this.scene.add.text(x - 20, y - 40, 'MERCHANT', { fontSize: '12px', fill: '#ffff00' });

        // Interaction
        this.scene.physics.add.overlap(this.scene.player.sprite, merchant, () => {
            if (this.scene.inputSystem.getInputs().interact) {
                eventBus.emit('open-shop');
            }
        });
    }

    spawnChest(x, y) {
        const chest = this.scene.physics.add.sprite(x, y, 'particle_white').setTint(0x884400).setScale(1.5);
        chest.body.setAllowGravity(true);
        this.scene.physics.add.collider(chest, this.scene.groundGroup);

        let opened = false;
        this.scene.physics.add.overlap(this.scene.player.sprite, chest, () => {
            if (!opened && this.scene.inputSystem.getInputs().interact) {
                opened = true;
                chest.setTint(0xaaaaaa); // Opened look
                // Loot
                this.scene.lootSystem.spawnOrb(x, y - 20, 'gold', 50);
                this.scene.lootSystem.rollItemDrop(x, y - 20);
            }
        });
    }

    spawnAltar(x, y) {
        const altar = this.scene.physics.add.sprite(x, y, 'particle_white').setTint(0xff0000).setScale(1.5, 3);
        altar.body.setAllowGravity(true);
        this.scene.physics.add.collider(altar, this.scene.groundGroup);

        let used = false;
        this.scene.physics.add.overlap(this.scene.player.sprite, altar, () => {
            if (!used && this.scene.inputSystem.getInputs().interact) {
                used = true;
                // Risk/Reward: Take damage, gain buff
                this.scene.player.takeDamage(20);
                this.scene.player.stats.damage += 2; // Permanent buff
                eventBus.emit('player-buff', { text: '+2 DMG (sacrificed HP)' });
            }
        });
    }
}
