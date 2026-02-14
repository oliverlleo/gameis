import { PHYSICS_CONFIG } from '../config/physicsConfig.js';
import eventBus from '../core/EventBus.js';

export default class EnemyBase {
    constructor(scene, x, y, textureKey) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, textureKey);
        this.sprite.entity = this; // Back-reference for collision

        // Physics
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setGravityY(PHYSICS_CONFIG.gravity);
        this.sprite.body.setSize(24, 24);

        // Stats
        this.stats = {
            hp: 50,
            maxHp: 50,
            damage: 10,
            xpReward: 10
        };

        // AI State
        this.state = 'IDLE';
        this.target = null;
        this.detectionRange = 400;
        this.attackRange = 50;
        this.attackCooldown = 2000;
        this.lastAttackTime = 0;

        // Movement
        this.moveSpeed = 100;
        this.patrolCenter = x;
        this.patrolRange = 200;
        this.patrolDir = 1;

        // Status
        this.statusEffects = [];
        this.speedMultiplier = 1.0;
    }

    update(time, delta) {
        if (!this.sprite.active) return;

        this.target = this.scene.player; // Simplify target acquisition

        // Status Updates handled by StatusSystem if registered, or here?
        // StatusSystem update is called by GameScene for all entities usually.
        // We'll assume GameScene calls StatusSystem.update(this, delta);

        this.handleState(time, delta);
        this.handleMovement(delta);
    }

    handleState(time, delta) {
        const dist = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, this.target.sprite.x, this.target.sprite.y);

        switch (this.state) {
            case 'IDLE':
                if (dist < this.detectionRange) this.state = 'CHASE';
                break;
            case 'CHASE':
                if (dist > this.detectionRange * 1.5) this.state = 'IDLE';
                else if (dist < this.attackRange && this.canAttack !== false) this.state = 'ATTACK';
                break;
            case 'ATTACK':
                if (time - this.lastAttackTime > this.attackCooldown) {
                    this.attack(time);
                } else {
                    // Back off or circle?
                    this.state = 'CHASE'; // Re-evaluate
                }
                break;
        }
    }

    handleMovement(delta) {
        if (this.state === 'IDLE' || this.state === 'PATROL') {
            // Simple Patrol
            if (this.sprite.x > this.patrolCenter + this.patrolRange) this.patrolDir = -1;
            else if (this.sprite.x < this.patrolCenter - this.patrolRange) this.patrolDir = 1;

            this.sprite.setVelocityX(this.moveSpeed * 0.5 * this.patrolDir * this.speedMultiplier);
            this.sprite.setFlipX(this.patrolDir < 0);
        } else if (this.state === 'CHASE') {
            const dir = this.target.sprite.x > this.sprite.x ? 1 : -1;
            this.sprite.setVelocityX(this.moveSpeed * dir * this.speedMultiplier);
            this.sprite.setFlipX(dir < 0);
        } else {
            this.sprite.setVelocityX(0);
        }
    }

    attack(time) {
        this.lastAttackTime = time;
        // Override in subclass
        // Default melee hit
        // Trigger generic attack event or hitbox check
        eventBus.emit('enemy-attack', { attacker: this, target: this.target });
        // Visual
        this.sprite.setTint(0xff0000);
        this.scene.time.delayedCall(200, () => this.sprite.clearTint());
    }

    takeDamage(amount, source) {
        this.stats.hp -= amount;
        this.sprite.setTint(0xffffff);
        this.scene.time.delayedCall(100, () => this.sprite.clearTint());

        if (this.stats.hp <= 0) {
            this.die();
        }
    }

    die() {
        eventBus.emit( 'enemy-died', { enemy: this, xp: this.stats.xpReward });
        this.sprite.destroy();
        this.active = false;
        // Cleanup from lists? handled by checking sprite.active
    }
}
