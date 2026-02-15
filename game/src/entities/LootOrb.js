import eventBus from '../core/EventBus.js';

export default class LootOrb extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type, value) {
        super(scene, x, y, 'particle_white'); // Use particle or special loot texture
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.type = type; // 'gold', 'item', 'xp'
        this.value = value;
        this.setTint(type === 'gold' ? 0xffff00 : (type === 'xp' ? 0x00ffff : 0xff00ff));
        this.setScale(1.5);
        this.setBounce(0.5);
        this.setCollideWorldBounds(true);
        this.body.setVelocityY(-200);
        this.body.setVelocityX(Phaser.Math.RND.between(-100, 100));

        // Magnet
        this.magnetRange = 100;
        this.collected = false;
    }

    update(time, delta) {
        if (this.collected) return;

        const player = this.scene.player;
        if (!player || !player.sprite) return;

        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.sprite.x, player.sprite.y);

        // Use player stats for pickup range if available
        const magnetRange = (player.stats && player.stats.pickupRange) ? player.stats.pickupRange : this.magnetRange;

        if (dist < magnetRange) {
            this.scene.physics.moveToObject(this, player.sprite, 400);
        }

        if (dist < 30) {
            this.collect();
        }
    }

    collect() {
        this.collected = true;
        if (this.type === 'gold') eventBus.emit('gold-gained', this.value);
        if (this.type === 'xp') eventBus.emit('xp-gained', this.value);
        if (this.type === 'item') eventBus.emit('item-pickup', this.value);

        this.scene.events.emit('play-sound', 'powerup');
        this.destroy();
    }
}
