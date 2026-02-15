import EnemyBase from './EnemyBase.js';
import eventBus from '../core/EventBus.js';

export default class EnemyAssassin extends EnemyBase {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy_melee');
        this.sprite.setTint(0x000000); // Black
        this.stats = { hp: 40, damage: 30, xpReward: 50 };
        this.moveSpeed = 150;
        this.teleportCooldown = 5000;
        this.lastTeleportTime = 0;
    }

    update(time, delta) {
        if (!this.active) return;
        super.update(time, delta);
        
        if (time - this.lastTeleportTime > this.teleportCooldown) {
            this.attemptTeleport(time);
        }
    }

    attemptTeleport(time) {
        const dist = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, this.target.sprite.x, this.target.sprite.y);
        if (dist < 300 && dist > 50) {
            // Teleport behind player
            const dir = this.target.facingRight ? -1 : 1;
            const targetX = this.target.sprite.x + (dir * 50);
            
            // Fade out
            this.scene.tweens.add({
                targets: this.sprite,
                alpha: 0,
                duration: 200,
                onComplete: () => {
                    this.sprite.x = targetX;
                    this.sprite.y = this.target.sprite.y; // Match Y
                    this.scene.tweens.add({
                        targets: this.sprite,
                        alpha: 1,
                        duration: 200,
                        onComplete: () => {
                            this.attack(time); // Immediate attack
                        }
                    });
                }
            });
            this.lastTeleportTime = time;
            eventBus.emit('enemy-teleport', { enemy: this });
        }
    }
}
