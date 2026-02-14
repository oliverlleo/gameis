import EnemyBase from './EnemyBase.js';
import { COMBAT_CONFIG } from '../config/combatConfig.js';
import eventBus from '../core/EventBus.js';

export default class EnemyMelee extends EnemyBase {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy_melee');

        this.stats = {
            hp: 80,
            maxHp: 80,
            damage: 15,
            xpReward: 25
        };

        this.attackRange = 60;
        this.attackCooldown = 2000;
        this.lastAttackTime = 0;
    }

    attack(time) {
        if (time - this.lastAttackTime < this.attackCooldown) return;
        this.lastAttackTime = time;

        // Visual telegraph
        this.sprite.setTint(0xff9900);
        this.scene.time.delayedCall(400, () => {
            if (!this.sprite.active) return;

            this.sprite.clearTint();
            // Lunge
            const dir = this.sprite.flipX ? -1 : 1;
            this.sprite.setVelocityX(dir * 300);

            // Hitbox check
            const hitbox = new Phaser.Geom.Rectangle(
                this.sprite.x + (dir * 20) - 20,
                this.sprite.y - 20,
                40,
                40
            );

            if (Phaser.Geom.Intersects.RectangleToRectangle(hitbox, this.scene.player.sprite.getBounds())) {
                // Apply Damage to Player
                // Assuming Player has takeDamage method?
                // Or emit event for CombatSystem to handle player damage
                // But CombatSystem handles Player -> Enemy mostly in my implementation so far.
                // I need to add player damage logic.
                // For now, emit event.
                eventBus.emit('player-damaged', { target: this.scene.player, amount: this.stats.damage });
                // And simple takeDamage on player
                if (this.scene.player.takeDamage) this.scene.player.takeDamage(this.stats.damage);
            }
        });
    }
}
