import { COMBAT_CONFIG } from '../config/combatConfig.js';
import eventBus from '../core/EventBus.js';

export default class CombatSystem {
    constructor(scene) {
        this.scene = scene;
    }

    handleHit(source, target) {
        // source and target are sprites. We need the entity wrapper.
        // Assuming entity is attached to sprite.data or we look it up.
        // Best practice: sprite.entity = this; in entity constructor.

        const attacker = source.entity;
        const defender = target.entity;

        if (!attacker || !defender) return;

        // I-frames check
        if (defender.isInvulnerable) return;

        // Damage Calculation
        let damage = 10; // Default
        if (attacker.stats && attacker.stats.damage) damage = attacker.stats.damage;

        // Crit?
        const isCrit = Math.random() < (attacker.stats.critChance || 0.05);
        if (isCrit) damage *= (attacker.stats.critMultiplier || 1.5);

        // Apply Damage
        defender.takeDamage(damage, attacker);

        // Knockback
        this.applyKnockback(defender, attacker);

        // Hitstop/Hitstun
        this.applyHitstop(attacker, defender);

        // Events/VFX
        eventBus.emit(EVENTS.ENEMY_DAMAGED, { target: defender, amount: damage, isCrit: isCrit });
        this.createHitVFX(defender.sprite.x, defender.sprite.y);
        this.createDamageNumber(defender, damage, isCrit);
    }

    applyKnockback(defender, attacker) {
        const dir = attacker.sprite.x < defender.sprite.x ? 1 : -1;
        const forceX = COMBAT_CONFIG.knockback.enemy.x * dir;
        const forceY = COMBAT_CONFIG.knockback.enemy.y;

        if (defender.sprite.body) {
            defender.sprite.setVelocity(forceX, forceY);
        }
    }

    applyHitstop(attacker, defender) {
        // Simple hitstop: pause physics for a few ms
        // This is global or per entity?
        // Global hitstop feels better for single player action.

        this.scene.physics.world.pause();
        this.scene.time.delayedCall(COMBAT_CONFIG.hitstopLight, () => {
             this.scene.physics.world.resume();
        });

        // Shake camera
        if (this.scene.cameraSystem) this.scene.cameraSystem.shake(0.005, 50);
    }

    createHitVFX(x, y) {
        // Use AssetGenerator 'particle_white'
        const particles = this.scene.add.particles(x, y, 'particle_white', {
            speed: { min: 50, max: 150 },
            angle: { min: 0, max: 360 },
            scale: { start: 1, end: 0 },
            lifespan: 300,
            quantity: 5
        });
        // Auto destroy? Phaser particles are emitters.
        // We want a burst then destroy.
        this.scene.time.delayedCall(300, () => particles.destroy());
    }

    createDamageNumber(entity, amount, isCrit) {
        const x = entity.sprite.x;
        const y = entity.sprite.y - 40;
        const color = isCrit ? '#ffff00' : '#ffffff';
        const fontSize = isCrit ? '24px' : '16px';

        const text = this.scene.add.text(x, y, Math.round(amount), {
            fontSize: fontSize,
            fill: color,
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.scene.tweens.add({
            targets: text,
            y: y - 50,
            alpha: 0,
            duration: 1000,
            onComplete: () => text.destroy()
        });
    }
}
