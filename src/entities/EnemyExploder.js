import EnemyBase from './EnemyBase.js';
import eventBus from '../core/EventBus.js';

export default class EnemyExploder extends EnemyBase {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy_melee');
        this.sprite.setTint(0xff5500); // Orange
        this.stats = { hp: 30, damage: 50, xpReward: 30 };
        this.moveSpeed = 150;
        this.explodeRange = 60;
    }

    update(time, delta) {
        super.update(time, delta);
        const dist = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, this.target.sprite.x, this.target.sprite.y);
        
        if (dist < this.explodeRange) {
            this.explode();
        }
    }

    explode() {
        if (!this.active) return;
        eventBus.emit('explosion', { x: this.sprite.x, y: this.sprite.y });
        
        // AOE Damage
        const dist = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, this.target.sprite.x, this.target.sprite.y);
        if (dist < 100) {
            this.target.takeDamage(this.stats.damage);
        }
        
        // VFX
        const circle = this.scene.add.circle(this.sprite.x, this.sprite.y, 100, 0xff5500, 0.5);
        this.scene.tweens.add({
            targets: circle,
            scale: 2,
            alpha: 0,
            duration: 300,
            onComplete: () => circle.destroy()
        });
        
        this.die();
    }
}
