import { PHYSICS_CONFIG } from '../config/physicsConfig.js';
import eventBus from '../core/EventBus.js';

export default class EnemyBase {
    constructor(scene, x, y, textureKey) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, textureKey);
        this.sprite.entity = this; 
        
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setGravityY(PHYSICS_CONFIG.gravity);
        this.sprite.body.setSize(24, 24);
        
        this.stats = {
            hp: 50, maxHp: 50,
            damage: 10, defense: 0,
            xpReward: 10
        };

        // FSM
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
        this.isInvulnerable = false;
        
        // Evade logic
        this.hpThresholdEvade = 0.3;
        this.hasEvaded = false;
    }

    update(time, delta) {
        if (!this.sprite.active || this.stats.hp <= 0) return;
        
        this.target = this.scene.player; 
        
        // Update Status
        if (this.scene.statusSystem) {
             // We need to call this externally or hook it here
             // Assuming StatusSystem handles its own update loop over a group?
             // No, StatusSystem.update(target, delta) is manual.
             // We should call it. But creating new StatusSystem every frame is bad.
             // Assume Scene has it.
             // this.scene.statusSystem.update(this, delta);
             // Actually, let's create a shared instance helper or just manual logic in StatusSystem
        }

        this.handleState(time, delta);
        this.handleMovement(delta);
    }

    handleState(time, delta) {
        const dist = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, this.target.sprite.x, this.target.sprite.y);
        const hpPct = this.stats.hp / this.stats.maxHp;

        switch (this.state) {
            case 'IDLE':
            case 'PATROL':
                if (dist < this.detectionRange) this.state = 'CHASE';
                break;
            case 'CHASE':
                if (dist > this.detectionRange * 1.5) this.state = 'PATROL';
                else if (dist < this.attackRange && this.canAttack !== false) this.state = 'ATTACK';
                else if (hpPct < this.hpThresholdEvade && !this.hasEvaded) this.state = 'EVADE';
                break;
            case 'ATTACK':
                if (time - this.lastAttackTime > this.attackCooldown) {
                    this.attack(time);
                } else {
                    // Recover/Circle?
                    if (dist > this.attackRange) this.state = 'CHASE';
                }
                break;
            case 'EVADE':
                // Retreat logic
                if (dist > this.detectionRange) {
                    this.state = 'RECOVER';
                }
                break;
            case 'RECOVER':
                // Wait for HP regen or cooldown?
                if (dist < this.detectionRange) this.state = 'CHASE'; // Re-engage
                break;
        }
    }

    handleMovement(delta) {
        const speed = this.moveSpeed * this.speedMultiplier;
        
        if (this.state === 'IDLE' || this.state === 'PATROL') {
            if (this.sprite.x > this.patrolCenter + this.patrolRange) this.patrolDir = -1;
            else if (this.sprite.x < this.patrolCenter - this.patrolRange) this.patrolDir = 1;
            this.sprite.setVelocityX(speed * 0.5 * this.patrolDir);
            this.sprite.setFlipX(this.patrolDir < 0);
        } else if (this.state === 'CHASE') {
            const dir = this.target.sprite.x > this.sprite.x ? 1 : -1;
            this.sprite.setVelocityX(speed * dir);
            this.sprite.setFlipX(dir < 0);
        } else if (this.state === 'EVADE') {
            const dir = this.target.sprite.x > this.sprite.x ? -1 : 1; // Run away
            this.sprite.setVelocityX(speed * 1.2 * dir);
            this.sprite.setFlipX(dir < 0);
            
            // Timeout evade
            this.scene.time.delayedCall(2000, () => {
                this.hasEvaded = true;
                this.state = 'CHASE';
            });
        } else {
            this.sprite.setVelocityX(0);
        }
    }

    attack(time) {
        this.lastAttackTime = time;
        eventBus.emit('enemy-attack', { attacker: this, target: this.target });
        this.sprite.setTint(0xff0000);
        this.scene.time.delayedCall(200, () => this.sprite.clearTint());
        
        // Simple hit
        const dist = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, this.target.sprite.x, this.target.sprite.y);
        if (dist < this.attackRange + 20) {
            this.target.takeDamage(this.stats.damage);
        }
    }

    takeDamage(amount, source) {
        const actual = Math.max(1, amount - this.stats.defense);
        this.stats.hp -= actual;
        
        this.sprite.setTint(0xffffff);
        this.scene.time.delayedCall(100, () => this.sprite.clearTint());
        
        // Knockback logic is in CombatSystem, but if we need custom reaction:
        if (this.stats.hp <= 0) {
            this.die();
        } else {
            // Aggro or Stun?
            this.state = 'CHASE';
        }
    }

    die() {
        if (!this.active) return;
        eventBus.emit( 'enemy-died', { enemy: this, xp: this.stats.xpReward });
        this.sprite.destroy();
        this.active = false;
    }
}
