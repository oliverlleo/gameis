import EnemyBase from './EnemyBase.js';
import eventBus from '../core/EventBus.js';

export default class EnemyExploder extends EnemyBase {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy_melee');
        this.sprite.setTint(0xff5500); 
        this.stats = { hp: 30, maxHp: 30, damage: 50, defense: 0, xpReward: 30 };
        this.moveSpeed = 150;
        this.explodeRange = 60;
    }

    update(time, delta) {
        if (!this.isAlive) return;
        super.update(time, delta);
        const dist = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, this.target.sprite.x, this.target.sprite.y);
        
        if (dist < this.explodeRange) {
            this.explode();
        }
    }

    explode() {
        if (!this.isAlive) return;
        eventBus.emit('explosion', { x: this.sprite.x, y: this.sprite.y });
        
        // AOE
        const dist = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, this.target.sprite.x, this.target.sprite.y);
        if (dist < 100) {
            this.target.takeDamage(this.stats.damage);
        }
        
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
