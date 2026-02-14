import { PHYSICS_CONFIG } from '../config/physicsConfig.js';
import SkillSystem from '../systems/SkillSystem.js';
import eventBus from '../core/EventBus.js';

export default class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.skillSystem = new SkillSystem(scene);
        this.sprite = scene.physics.add.sprite(x, y, 'player_idle');
        this.sprite.setCollideWorldBounds(true);

        // Physics Setup
        this.sprite.setGravityY(PHYSICS_CONFIG.gravity);
        this.sprite.setMaxVelocity(PHYSICS_CONFIG.maxHorizontalSpeed, PHYSICS_CONFIG.maxFallSpeed);
        this.sprite.setDragX(PHYSICS_CONFIG.deceleration);

        // Hitbox adjustments
        this.sprite.body.setSize(16, 24);
        this.sprite.body.setOffset(8, 16);

        // State
        this.state = 'IDLE';
        this.facingRight = true;
        this.isGrounded = false;
        this.coyoteTimeCounter = 0;
        this.jumpBufferCounter = 0;

        // Stats
        this.stats = {
            hp: 100,
            maxHp: 100,
            energy: 100,
            maxEnergy: 100,
            defense: 0
        };

        this.invulnerable = false;
        this.invulnerableTimer = 0;

        this.createAnimations();
    }

    takeDamage(amount) {
        if (this.invulnerable || this.state === 'DEAD') return;

        const actualDamage = Math.max(1, amount - this.stats.defense);
        this.stats.hp -= actualDamage;

        // I-frames
        this.invulnerable = true;
        this.sprite.setAlpha(0.5);
        this.scene.time.delayedCall(PHYSICS_CONFIG.iframeDuration, () => {
            this.invulnerable = false;
            this.sprite.setAlpha(1);
        });

        // Knockback (simple)
        this.sprite.setVelocityY(-200);
        this.sprite.setVelocityX(this.facingRight ? -200 : 200);

        eventBus.emit('player-damaged', { hp: this.stats.hp, maxHp: this.stats.maxHp });

        if (this.stats.hp <= 0) {
            this.die();
        }
    }

    die() {
        this.state = 'DEAD';
        this.sprite.setTint(0x555555);
        this.scene.time.delayedCall(1000, () => {
            this.scene.scene.start('GameOverScene');
        });
    }

    createAnimations() {
        if (!this.scene.anims.exists('player_idle')) {
            this.scene.anims.create({
                key: 'player_idle',
                frames: [ { key: 'player_idle' } ],
                frameRate: 1,
                repeat: -1
            });
            this.scene.anims.create({
                key: 'player_run',
                frames: [
                    { key: 'player_run_1' },
                    { key: 'player_run_2' }
                ],
                frameRate: 8,
                repeat: -1
            });
            this.scene.anims.create({
                key: 'player_jump',
                frames: [ { key: 'player_jump' } ],
                frameRate: 1
            });
            this.scene.anims.create({
                key: 'player_attack',
                frames: [ { key: 'player_attack' } ],
                frameRate: 10
            });
        }
    }

    update(time, delta, inputs) {
        const body = this.sprite.body;
        const onGround = body.blocked.down;

        // Coyote Time Logic
        if (onGround) {
            this.isGrounded = true;
            this.coyoteTimeCounter = PHYSICS_CONFIG.coyoteTime;
        } else {
            this.isGrounded = false;
            this.coyoteTimeCounter -= delta;
        }

        // Jump Logic
        if (inputs.jumpBuffered && this.coyoteTimeCounter > 0) {
            this.jump();
            // Signal consumption
            if (this.scene.inputSystem && this.scene.inputSystem.consumeJumpBuffer) {
                this.scene.inputSystem.consumeJumpBuffer();
            }
            this.coyoteTimeCounter = 0;
        }

        // Jump Cut (Variable Jump Height)
        if (!inputs.jumpHeld && body.velocity.y < 0) {
            body.setGravityY(PHYSICS_CONFIG.gravity * PHYSICS_CONFIG.jumpCutMultiplier);
        } else if (body.velocity.y > 0) {
            body.setGravityY(PHYSICS_CONFIG.gravity * PHYSICS_CONFIG.fallMultiplier);
        } else {
            body.setGravityY(PHYSICS_CONFIG.gravity);
        }

        // Horizontal Movement
        if (this.state !== 'ATTACK') {
            if (inputs.x !== 0) {
                body.setAccelerationX(inputs.x * PHYSICS_CONFIG.horizontalAcceleration);
                this.facingRight = inputs.x > 0;
                this.sprite.setFlipX(!this.facingRight);
                if (onGround) this.state = 'RUN';
            } else {
                body.setAccelerationX(0); // This relies on drag to stop
                if (onGround) this.state = 'IDLE';
            }
        }

        // Air State overrides ground state
        if (!onGround && this.state !== 'ATTACK') {
            if (body.velocity.y < 0) this.state = 'JUMP';
            else this.state = 'FALL';
        }

        // Attack Trigger
        if (inputs.attack && this.state !== 'ATTACK') {
            this.startAttack();
        }

        // Skills
        const enemies = this.scene.getEnemies ? this.scene.getEnemies() : [];
        if (inputs.skill1) this.skillSystem.useSkill(this, 'ascendingRupture', enemies);
        if (inputs.skill2) this.skillSystem.useSkill(this, 'shadowStep', enemies);
        if (inputs.skill3) this.skillSystem.useSkill(this, 'flowBlade', enemies);
        if (inputs.skill4) this.skillSystem.useSkill(this, 'freezingPrism', enemies);
        if (inputs.skill5) this.skillSystem.useSkill(this, 'overloadCore', enemies);

        this.updateAnimation();
    }

    jump() {
        this.sprite.setVelocityY(PHYSICS_CONFIG.jumpInitialVelocity);
        // Sound can be handled by event bus or scene
        // eventBus.emit('play-sound', 'jump');
    }

    startAttack() {
        this.state = 'ATTACK';
        this.sprite.play('player_attack');
        this.sprite.once('animationcomplete', () => {
            this.state = 'IDLE'; // Reset to IDLE, next update loop will set correct state (RUN/JUMP)
        });
        // Hitbox handling is separate or here?
        // CombatSystem handles overlaps.
        // But maybe visual or sound
    }

    updateAnimation() {
        if (this.state === 'ATTACK') return;

        let animKey = 'player_idle';
        if (this.state === 'RUN') animKey = 'player_run';
        if (this.state === 'JUMP') animKey = 'player_jump';
        if (this.state === 'FALL') animKey = 'player_jump';

        if (this.sprite.anims.currentAnim?.key !== animKey) {
            this.sprite.play(animKey, true);
        }
    }
}
