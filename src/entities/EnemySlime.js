import EnemyBase from './EnemyBase.js';
import { PHYSICS_CONFIG } from '../config/physicsConfig.js';

export default class EnemySlime extends EnemyBase {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy_melee');
        this.sprite.setTint(0x00ff00);
        this.sprite.setScale(0.8, 0.6); // Squashed
        this.stats = { hp: 30, damage: 10, xpReward: 15 };

        this.jumpTimer = 0;
        this.jumpCooldown = 1500;
        this.moveSpeed = 100;
    }

    handleMovement(delta) {
        if (this.sprite.body.blocked.down) {
            this.sprite.setVelocityX(0); // Stop when grounded
            this.jumpTimer += delta;

            if (this.jumpTimer > this.jumpCooldown) {
                this.jumpTimer = 0;
                // Jump towards player
                const dir = this.target.sprite.x > this.sprite.x ? 1 : -1;
                this.sprite.setVelocityY(PHYSICS_CONFIG.jumpInitialVelocity);
                this.sprite.setVelocityX(this.moveSpeed * dir);
                this.sprite.setFlipX(dir < 0);
            }
        }
    }
}
