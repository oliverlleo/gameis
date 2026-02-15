import { PHYSICS_CONFIG } from '../config/physicsConfig.js';
import { COMBAT_CONFIG } from '../config/combatConfig.js';
import SkillSystem from '../systems/SkillSystem.js';
import eventBus from '../core/EventBus.js';

export default class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.skillSystem = new SkillSystem(scene);

        // Physics Sprite
        this.sprite = scene.physics.add.sprite(x, y, 'player_idle');
        this.sprite.entity = this; // Back-reference for CombatSystem
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.setGravityY(PHYSICS_CONFIG.gravity);
        this.sprite.body.setMaxVelocity(PHYSICS_CONFIG.maxHorizontalSpeed, PHYSICS_CONFIG.maxFallSpeed);
        this.sprite.body.setDragX(PHYSICS_CONFIG.deceleration);
        this.sprite.body.setSize(16, 24);
        this.sprite.body.setOffset(8, 16);

        // State Machine
        this.state = 'IDLE';
        this.facingRight = true;
        this.isGrounded = false;
        this.coyoteTimeCounter = 0;

        // Combat State
        this.comboCount = 0;
        this.lastAttackTime = 0;
        this.isAttacking = false;
        this.canCancel = false;
        this.heavyChargeTime = 0;
        this.isCharging = false;

        // Stats
        this.stats = {
            hp: 100, maxHp: 100,
            energy: 100, maxEnergy: 100,
            damage: 10, defense: 0,
            critChance: 0.05, critMultiplier: 1.5,
            attackSpeed: 1,
            moveSpeedMult: 1,
            pickupRange: 100
        };

        this.isInvulnerable = false;

        this.createAnimations();
    }

    createAnimations() {
        if (!this.scene.anims.exists('player_idle')) {
            this.scene.anims.create({ key: 'player_idle', frames: [ { key: 'player_idle' } ], frameRate: 1, repeat: -1 });
            this.scene.anims.create({ key: 'player_run', frames: [ { key: 'player_run_1' }, { key: 'player_run_2' } ], frameRate: 8, repeat: -1 });
            this.scene.anims.create({ key: 'player_jump', frames: [ { key: 'player_jump' } ], frameRate: 1 });

            // Attacks
            this.scene.anims.create({ key: 'player_attack_1', frames: [ { key: 'player_attack' } ], duration: 100 });
            this.scene.anims.create({ key: 'player_attack_2', frames: [ { key: 'player_attack' } ], duration: 100 });
            this.scene.anims.create({ key: 'player_attack_3', frames: [ { key: 'player_attack' } ], duration: 150 });
            this.scene.anims.create({ key: 'player_attack_heavy', frames: [ { key: 'player_attack' } ], duration: 300 });
        }
    }

    update(time, delta, inputs) {
        if (this.stats.hp <= 0) return;

        const body = this.sprite.body;
        const onGround = body.blocked.down;

        // Ground/Air Logic
        if (onGround) {
            this.isGrounded = true;
            this.coyoteTimeCounter = PHYSICS_CONFIG.coyoteTime;
        } else {
            this.isGrounded = false;
            this.coyoteTimeCounter -= delta;
        }

        // Jump
        if (inputs.jumpBuffered && this.coyoteTimeCounter > 0 && !this.isAttacking) {
            this.jump();
            if (this.scene.inputSystem.consumeJumpBuffer) this.scene.inputSystem.consumeJumpBuffer();
            this.coyoteTimeCounter = 0;
        }

        // Variable Jump Height
        if (!inputs.jumpHeld && body.velocity.y < 0) {
            body.setGravityY(PHYSICS_CONFIG.gravity * PHYSICS_CONFIG.jumpCutMultiplier);
        } else if (body.velocity.y > 0) {
            body.setGravityY(PHYSICS_CONFIG.gravity * PHYSICS_CONFIG.fallMultiplier);
        } else {
            body.setGravityY(PHYSICS_CONFIG.gravity);
        }

        // Combat Input
        if (inputs.attack) { // Button Just Pressed
            this.handleAttackInput(time);
        }

        // Heavy Charge Logic (implied hold)
        // Since input system only gives boolean for press, we'd need 'held' state.
        // Assuming `inputs.attack` is just pressed.
        // Let's rely on a separate Heavy Attack button or Hold logic if InputSystem supports it.
        // InputSystem currently only provides `attack` boolean (JustDown).
        // Let's implement simplified Combo.

        // Movement (Only if not attacking or if can cancel)
        if (!this.isAttacking || this.canCancel) {
            if (inputs.x !== 0) {
                const speed = PHYSICS_CONFIG.maxHorizontalSpeed * this.stats.moveSpeedMult;
                body.setAccelerationX(inputs.x * PHYSICS_CONFIG.horizontalAcceleration);
                this.facingRight = inputs.x > 0;
                this.sprite.setFlipX(!this.facingRight);
                if (onGround && !this.isAttacking) this.state = 'RUN';
            } else {
                body.setAccelerationX(0);
                if (onGround && !this.isAttacking) this.state = 'IDLE';
            }
        } else {
            // Stop during attack (ground friction handles it)
            body.setAccelerationX(0);
        }

        // Air State
        if (!onGround && !this.isAttacking) {
            this.state = body.velocity.y < 0 ? 'JUMP' : 'FALL';
        }

        this.updateAnimation();

        // Skills
        const enemies = this.scene.getEnemies();
        if (inputs.skill1) this.skillSystem.useSkill(this, 'ascendingRupture', enemies);
        if (inputs.skill2) this.skillSystem.useSkill(this, 'shadowStep', enemies);
        if (inputs.skill3) this.skillSystem.useSkill(this, 'flowBlade', enemies);
        if (inputs.skill4) this.skillSystem.useSkill(this, 'freezingPrism', enemies);
        if (inputs.skill5) this.skillSystem.useSkill(this, 'overloadCore', enemies);
    }

    handleAttackInput(time) {
        if (this.isAttacking && !this.canCancel) return; // Locked

        // Reset combo if window expired (1s)
        if (time - this.lastAttackTime > 1000) {
            this.comboCount = 0;
        }

        // Determine Attack Type
        let type = 'light1';
        if (this.comboCount === 1) type = 'light2';
        if (this.comboCount === 2) type = 'light3';

        // Execute
        this.performAttack(type, time);
    }

    performAttack(type, time) {
        this.isAttacking = true;
        this.canCancel = false;
        this.state = 'ATTACK';
        this.lastAttackTime = time;

        const config = COMBAT_CONFIG.player[type];
        // Scale duration by attack speed
        const speed = this.stats.attackSpeed || 1;
        const totalFrames = config.startup + config.active + config.recovery;
        const duration = totalFrames / speed;

        // Play Anim
        const animKey = 'player_attack_' + (this.comboCount + 1);
        this.sprite.play(animKey);

        // Hitbox Event
        // Ideally we use animation events, but timer is safer without complex asset setup
        this.scene.time.delayedCall(config.startup / speed, () => {
             this.createHitbox(type);
        });

        // Recovery/Cancel Window
        this.scene.time.delayedCall((config.startup + config.active) / speed, () => {
             this.canCancel = true; // Allow cancelling into next attack or move
        });

        // End Attack
        this.scene.time.delayedCall(duration, () => {
             this.isAttacking = false;
             if (this.state === 'ATTACK') this.state = 'IDLE';
        });

        // Advance Combo
        this.comboCount = (this.comboCount + 1) % 3;
    }

    createHitbox(type) {
        const range = type === 'light3' ? 80 : 50;
        const damageMult = type === 'light3' ? 1.5 : 1.0;

        // Simple forward rect
        const offsetX = this.facingRight ? 0 : -range;
        const rect = new Phaser.Geom.Rectangle(
            this.sprite.x + offsetX,
            this.sprite.y - 20,
            range,
            40
        );

        // Debug draw
        // const g = this.scene.add.graphics().lineStyle(1, 0xff0000).strokeRectShape(rect);
        // this.scene.time.delayedCall(100, () => g.destroy());

        const enemies = this.scene.getEnemies();
        let hit = false;

        enemies.forEach(e => {
            if (e.sprite && e.sprite.active && Phaser.Geom.Intersects.RectangleToRectangle(rect, e.sprite.getBounds())) {
                // Use CombatSystem to calculate damage
                this.scene.combatSystem.handleHit(this.sprite, e.sprite, damageMult);
                hit = true;
            }
        });

        if (hit) {
            // Screen Shake
            this.scene.cameras.main.shake(50, 0.002);
            // Hitstop
            this.scene.combatSystem.applyHitstop();
        }
    }

    jump() {
        this.sprite.setVelocityY(PHYSICS_CONFIG.jumpInitialVelocity);
        this.state = 'JUMP';
    }

    takeDamage(amount) {
        if (this.isInvulnerable || this.state === 'DEAD') return;

        const actualDamage = Math.max(1, amount - this.stats.defense);
        this.stats.hp -= actualDamage;

        this.isInvulnerable = true;
        this.sprite.setAlpha(0.5);
        this.scene.time.delayedCall(PHYSICS_CONFIG.iframeDuration, () => {
            this.isInvulnerable = false;
            this.sprite.setAlpha(1);
        });

        eventBus.emit('player-damaged', { hp: this.stats.hp, maxHp: this.stats.maxHp });

        if (this.stats.hp <= 0) this.die();
    }

    die() {
        this.state = 'DEAD';
        this.sprite.setTint(0x555555);
        this.scene.time.delayedCall(1000, () => {
            this.scene.scene.start('GameOverScene');
        });
    }

    updateAnimation() {
        if (this.isAttacking) return;

        let anim = 'player_idle';
        if (this.state === 'RUN') anim = 'player_run';
        if (this.state === 'JUMP') anim = 'player_jump';
        if (this.state === 'FALL') anim = 'player_jump';

        if (this.sprite.anims.currentAnim?.key !== anim) {
            this.sprite.play(anim, true);
        }
    }
}
