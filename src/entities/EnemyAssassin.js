import EnemyBase from './EnemyBase.js';
import eventBus from '../core/EventBus.js';

export default class EnemyAssassin extends EnemyBase {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy_melee');
        this.sprite.setTint(0x000000); 
        this.stats = { hp: 40, maxHp: 40, damage: 30, defense: 0, xpReward: 50 };
        this.moveSpeed = 150;
        this.teleportCooldown = 5000;
        this.lastTeleportTime = 0;
    }

    update(time, delta) {
        if (!this.isAlive) return;
        super.update(time, delta);
        
        if (time - this.lastTeleportTime > this.teleportCooldown) {
            this.attemptTeleport(time);
        }
    }

    attemptTeleport(time) {
        if (!this.isAlive) return;
        
        const dist = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, this.target.sprite.x, this.target.sprite.y);
        if (dist < 300 && dist > 50) {
            const dir = this.target.facingRight ? -1 : 1;
            const targetX = this.target.sprite.x + (dir * 50);
            
            this.scene.tweens.add({
                targets: this.sprite,
                alpha: 0,
                duration: 200,
                onComplete: () => {
                    if (!this.isAlive) return;
                    this.sprite.x = targetX;
                    this.sprite.y = this.target.sprite.y; 
                    this.scene.tweens.add({
                        targets: this.sprite,
                        alpha: 1,
                        duration: 200,
                        onComplete: () => {
                            if(this.isAlive) this.attack(time); 
                        }
                    });
                }
            });
            this.lastTeleportTime = time;
            eventBus.emit('enemy-teleport', { enemy: this });
        }
    }
}
