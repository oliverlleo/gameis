import { PHYSICS_CONFIG } from '../config/physicsConfig.js';
import eventBus from '../core/EventBus.js';
import { EVENTS } from '../core/Constants.js';

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

        // Lifecycle
        this.isAlive = true;
        this.active = true; // Sync with sprite active?

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
        if (!this.isAlive || !this.sprite.active) return;
        
        this.target = this.scene.player; 
        
        // Manual Status Update called by GameScene loop over group
        
        this.handleState(time, delta);
        this.handleMovement(delta);
    }

    handleState(time, delta) {
        if (!this.target || !this.target.sprite) return;
        
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
                    if (dist > this.attackRange) this.state = 'CHASE';
                }
                break;
            case 'EVADE':
                if (dist > this.detectionRange) {
                    this.state = 'RECOVER';
                }
                break;
            case 'RECOVER':
                if (dist < this.detectionRange) this.state = 'CHASE'; 
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
            const dir = this.target.sprite.x > this.sprite.x ? -1 : 1; 
            this.sprite.setVelocityX(speed * 1.2 * dir);
            this.sprite.setFlipX(dir < 0);
            
            if (!this.evadeTimer) {
                this.evadeTimer = this.scene.time.delayedCall(2000, () => {
                    this.hasEvaded = true;
                    if(this.isAlive) this.state = 'CHASE';
                    this.evadeTimer = null;
                });
            }
        } else {
            this.sprite.setVelocityX(0);
        }
    }

    attack(time) {
        if (!this.isAlive) return;
        this.lastAttackTime = time;
        eventBus.emit(EVENTS.ENEMY_ATTACK || 'enemy-attack', { attacker: this, target: this.target });
        this.sprite.setTint(0xff0000);
        this.scene.time.delayedCall(200, () => {
            if(this.isAlive && this.sprite.active) this.sprite.clearTint();
        });
        
        const dist = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, this.target.sprite.x, this.target.sprite.y);
        if (dist < this.attackRange + 20) {
            // Apply damage via CombatSystem? 
            // Better to emit event or call takeDamage directly if simple
            // Using CombatSystem is P1. For P0, direct call safe.
            if(this.target.takeDamage) this.target.takeDamage(this.stats.damage);
        }
    }

    takeDamage(amount, source) {
        if (!this.isAlive) return;
        
        const actual = Math.max(1, amount - this.stats.defense);
        this.stats.hp -= actual;
        
        this.sprite.setTint(0xffffff);
        this.scene.time.delayedCall(100, () => {
            if(this.isAlive && this.sprite.active) this.sprite.clearTint();
        });
        
        if (this.stats.hp <= 0) {
            this.die();
        } else {
            this.state = 'CHASE';
        }
    }

    die() {
        if (!this.isAlive) return;
        this.isAlive = false;
        this.active = false;
        
        // Emit exactly once
        eventBus.emit(EVENTS.ENEMY_DIED || 'enemy-died', { enemy: this, xp: this.stats.xpReward });
        
        // Cleanup
        if (this.sprite) {
            this.sprite.destroy();
            this.sprite = null;
        }
        
        // Cancel any timers?
        if (this.evadeTimer) this.evadeTimer.remove(false);
    }
}
