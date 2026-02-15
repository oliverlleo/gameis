import { COMBAT_CONFIG } from '../config/combatConfig.js';
import { EVENTS } from '../core/Constants.js';
import eventBus from '../core/EventBus.js';

export default class CombatSystem {
    constructor(scene) {
        this.scene = scene;
    }

    handleHit(source, target, multiplier = 1.0) {
        const attacker = source.entity;
        const defender = target.entity;
        
        if (!attacker || !defender) return;
        
        // Check I-Frames
        if (defender.isInvulnerable) return;

        // Damage Calculation
        let damage = 10;
        if (attacker.stats && attacker.stats.damage) {
            damage = attacker.stats.damage * multiplier;
        }
        
        // Crit Calculation
        const critChance = attacker.stats.critChance || 0.05;
        const isCrit = Math.random() < critChance;
        if (isCrit) {
            damage *= (attacker.stats.critMultiplier || 1.5);
        }

        // Apply Damage (target entity must handle it)
        if (defender.takeDamage) {
            defender.takeDamage(damage, attacker);
        }

        // Knockback
        this.applyKnockback(defender, attacker);

        // Visuals/Events
        eventBus.emit(EVENTS.ENEMY_DAMAGED, { target: defender, amount: damage, isCrit: isCrit });
        this.createDamageNumber(defender, damage, isCrit);
        this.createHitVFX(defender.sprite.x, defender.sprite.y);
    }

    applyKnockback(defender, attacker) {
        const dir = attacker.sprite.x < defender.sprite.x ? 1 : -1;
        const forceX = COMBAT_CONFIG.knockback.enemy.x * dir;
        const forceY = COMBAT_CONFIG.knockback.enemy.y;
        
        if (defender.sprite.body) {
            defender.sprite.setVelocity(forceX, forceY);
        }
    }

    applyHitstop() {
        this.scene.physics.world.pause();
        this.scene.time.delayedCall(COMBAT_CONFIG.hitstop.light, () => {
             this.scene.physics.world.resume();
        });
    }

    createHitVFX(x, y) {
        // Particles
        const particles = this.scene.add.particles(x, y, 'particle_white', {
            speed: { min: 50, max: 150 },
            scale: { start: 1, end: 0 },
            lifespan: 300,
            quantity: 5
        });
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
            duration: 800,
            onComplete: () => text.destroy()
        });
    }
}
