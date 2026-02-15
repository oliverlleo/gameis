import EnemyBase from './EnemyBase.js';
import Projectile from './Projectile.js';

export default class EnemyRanged extends EnemyBase {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy_ranged');
        this.stats = { hp: 40, damage: 10, xpReward: 20 };
        this.detectionRange = 500;
        this.attackRange = 400;
        this.fleeRange = 150;
        this.attackCooldown = 3000;

        this.projectiles = scene.physics.add.group({ classType: Projectile, runChildUpdate: true });

        // Add overlap for projectiles against player
        // Parameters: (object1, object2) -> (projectile, playerSprite)
        scene.physics.add.overlap(this.projectiles, scene.player.sprite, (projectile, playerSprite) => {
            if (projectile.active) {
                scene.player.takeDamage(this.stats.damage);
                projectile.setActive(false).setVisible(false);
            }
        });
    }

    handleState(time, delta) {
        const dist = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, this.target.sprite.x, this.target.sprite.y);

        if (dist < this.fleeRange) {
            this.state = 'FLEE';
        } else if (dist < this.attackRange && time - this.lastAttackTime > this.attackCooldown) {
            this.state = 'ATTACK';
        } else if (dist < this.detectionRange && dist > this.fleeRange) {
            this.state = 'IDLE'; // Hold position if in range
        } else {
            this.state = 'IDLE';
        }
    }

    handleMovement(delta) {
        if (this.state === 'FLEE') {
            const dir = this.target.sprite.x > this.sprite.x ? -1 : 1;
            this.sprite.setVelocityX(this.moveSpeed * dir);
            this.sprite.setFlipX(dir < 0);
        } else {
            this.sprite.setVelocityX(0);
        }
    }

    attack(time) {
        if (this.state === 'ATTACK') { // Already in state
             // Trigger fire
             this.lastAttackTime = time;
             const proj = this.projectiles.get(this.sprite.x, this.sprite.y, 'projectile_basic');
             if (proj) {
                 proj.setActive(true).setVisible(true);
                 proj.fire(this.target.sprite.x, this.target.sprite.y - 10, 300);
             }
             this.state = 'IDLE'; // Reset to wait for cooldown
        }
    }

    update(time, delta) {
        super.update(time, delta);
        if (this.state === 'ATTACK') {
             this.attack(time);
        }
    }
}
