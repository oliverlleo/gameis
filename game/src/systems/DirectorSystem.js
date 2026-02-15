import { COMBAT_CONFIG } from '../config/combatConfig.js';
import eventBus from '../core/EventBus.js';
import BossA from '../entities/BossA.js';
import BossB from '../entities/BossB.js';

export default class DirectorSystem {
    constructor(scene) {
        this.scene = scene;
        this.difficulty = 1;
        this.timer = 0;
        this.eventTimer = 0;
        this.eventInterval = 30000; // Check event every 30s

        // Milestones
        this.milestones = [
            { dist: 2500, type: 'boss_a', completed: false },
            { dist: 6000, type: 'boss_b', completed: false }
        ];
    }

    update(time, delta) {
        this.timer += delta;
        this.difficulty = 1 + (this.timer / 60000);

        // Event Spawning
        this.eventTimer += delta;
        if (this.eventTimer > this.eventInterval) {
            this.eventTimer = 0;
            this.trySpawnEvent();
        }

        // Milestones
        const playerX = this.scene.player.sprite.x;
        this.milestones.forEach(m => {
            if (!m.completed && playerX > m.dist) {
                m.completed = true;
                this.spawnBoss(m.type, playerX + 600);
            }
        });
    }

    spawnBoss(type, x) {
        // Pause chunk generation or clear area?
        // Ideally clear local enemies

        let boss;
        const y = this.scene.game.config.height - 200;
        if (type === 'boss_a') {
            boss = new BossA(this.scene, x, y);
        } else {
            boss = new BossB(this.scene, x, y - 100);
        }

        this.scene.enemiesGroup.add(boss.sprite);

        eventBus.emit('boss-spawn', { type: type });
        // Maybe lock camera?
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
