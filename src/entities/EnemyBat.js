import EnemyBase from './EnemyBase.js';

export default class EnemyBat extends EnemyBase {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy_melee'); // Re-use melee for now or add bat to AssetGenerator
        this.sprite.setTint(0x444444);
        this.sprite.body.setAllowGravity(false);
        this.stats = { hp: 20, damage: 5, xpReward: 10 };
        this.moveSpeed = 200;
        this.sprite.setScale(0.8);
    }

    handleMovement(delta) {
        // Swooping movement
        const time = this.scene.time.now * 0.005;
        const dx = this.target.sprite.x - this.sprite.x;
        const dy = (this.target.sprite.y - 50) - this.sprite.y + Math.sin(time) * 50; // Bobbing

        const angle = Math.atan2(dy, dx);
        this.sprite.setVelocityX(Math.cos(angle) * this.moveSpeed);
        this.sprite.setVelocityY(Math.sin(angle) * this.moveSpeed);

        this.sprite.setFlipX(dx < 0);
    }
}
