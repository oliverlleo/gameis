import EnemyBase from './EnemyBase.js';
import eventBus from '../core/EventBus.js';

export default class EnemySupport extends EnemyBase {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy_ranged'); // Use ranged texture
        this.sprite.setTint(0x00ff00); // Green tint
        
        this.stats = {
            hp: 60,
            maxHp: 60,
            damage: 5,
            xpReward: 30
        };
        
        this.healCooldown = 4000;
        this.healAmount = 20;
        this.healRange = 200;
        this.lastHealTime = 0;
    }

    update(time, delta) {
        super.update(time, delta);
        
        if (time - this.lastHealTime > this.healCooldown) {
            this.healLowestAlly(time);
        }
    }
    
    healLowestAlly(time) {
        const allies = this.scene.getEnemies().filter(e => e !== this && e.sprite.active && e.stats.hp < e.stats.maxHp);
        if (allies.length === 0) return;
        
        // Sort by HP percent
        allies.sort((a, b) => (a.stats.hp / a.stats.maxHp) - (b.stats.hp / b.stats.maxHp));
        const target = allies[0];
        
        const dist = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, target.sprite.x, target.sprite.y);
        
        if (dist < this.healRange) {
            target.stats.hp = Math.min(target.stats.maxHp, target.stats.hp + this.healAmount);
            // Visual
            target.sprite.setTint(0x00ff00);
            this.scene.time.delayedCall(200, () => target.sprite.clearTint());
            this.lastHealTime = time;
            eventBus.emit('enemy-healed', { healer: this, target: target });
        } else {
            // Move towards ally
            const dir = target.sprite.x > this.sprite.x ? 1 : -1;
            this.sprite.setVelocityX(this.moveSpeed * dir);
        }
    }
}
