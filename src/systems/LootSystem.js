import { LOOT_TABLES } from '../config/lootTables.js';
import { PROGRESSION_CONFIG } from '../config/progressionConfig.js';
import LootOrb from '../entities/LootOrb.js';
import eventBus from '../core/EventBus.js';

export default class LootSystem {
    constructor(scene) {
        this.scene = scene;
        this.lootGroup = scene.physics.add.group({ classType: LootOrb, runChildUpdate: true });
        
        eventBus.on('enemy-died', this.handleEnemyDeath, this);
        
        // Add collider with ground
        scene.physics.add.collider(this.lootGroup, scene.groundGroup);
        
        // Add overlap with player
        // Parameters: (object1, object2) -> (playerSprite, lootOrb)
        scene.physics.add.overlap(scene.player.sprite, this.lootGroup, (playerSprite, lootOrb) => {
            if (lootOrb.active && lootOrb.collect) lootOrb.collect();
        });
    }

    handleEnemyDeath(data) {
        const { enemy, xp } = data;
        const x = enemy.sprite.x;
        const y = enemy.sprite.y;
        
        // Drop XP Orb
        this.spawnOrb(x, y, 'xp', xp);
        
        // Drop Gold
        const goldAmount = Math.floor(xp * (0.5 + Math.random())); // Gold roughly equal to XP
        if (goldAmount > 0) this.spawnOrb(x + 10, y, 'gold', goldAmount);
        
        // Drop Item Chance
        if (Math.random() < 0.2) { // 20% chance
            this.rollItemDrop(x, y);
        }
    }

    spawnOrb(x, y, type, value) {
        const orb = this.lootGroup.get(x, y, 'particle_white'); // Reuse texture
        if (orb) {
            orb.setActive(true).setVisible(true);
            orb.body.enable = true;
            orb.type = type;
            orb.value = value;
            orb.setTint(type === 'gold' ? 0xffff00 : (type === 'xp' ? 0x00ffff : 0xff00ff));
            orb.body.setVelocityY(-200);
            orb.body.setVelocityX(Phaser.Math.RND.between(-50, 50));
            orb.collected = false;
        }
    }

    rollItemDrop(x, y) {
        const rarityRoll = Math.random() * 100;
        let rarity = 'common';
        const weights = PROGRESSION_CONFIG.loot;
        
        if (rarityRoll < weights.legendary) rarity = 'legendary';
        else if (rarityRoll < weights.epic) rarity = 'epic';
        else if (rarityRoll < weights.rare) rarity = 'rare';
        else if (rarityRoll < weights.uncommon) rarity = 'uncommon';
        
        const possibleItems = LOOT_TABLES.filter(i => i.rarity === rarity);
        if (possibleItems.length > 0) {
            const item = Phaser.Math.RND.pick(possibleItems);
            // Spawn item orb
            // For now, items are just objects. We can spawn an orb that gives the item.
            this.spawnOrb(x, y - 20, 'item', item);
        }
    }
}
