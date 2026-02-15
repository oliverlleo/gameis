import { COMBAT_CONFIG } from '../config/combatConfig.js';
import eventBus from '../core/EventBus.js';

export default class StatusSystem {
    constructor(scene) {
        this.scene = scene;
    }

    applyStatus(target, type, durationOverride = null) {
        if (!target.statusEffects) target.statusEffects = [];

        const config = COMBAT_CONFIG.status[type];
        if (!config) return;

        const duration = durationOverride || config.duration;

        // Refresh or Add
        const existing = target.statusEffects.find(e => e.type === type);
        if (existing) {
            existing.duration = duration;
            if (config.stackable) existing.stacks = (existing.stacks || 1) + 1;
        } else {
            target.statusEffects.push({
                type: type,
                duration: duration,
                tickTimer: 0,
                stacks: 1,
                config: config
            });

            // Initial
            if (type === 'freeze') {
                target.speedMultiplier = config.slow;
                if (target.sprite) target.sprite.setTint(0x00ffff);
            }
            if (type === 'burn') {
                if (target.sprite) target.sprite.setTint(0xff0000);
            }
        }
    }

    update(target, delta) {
        if (!target.statusEffects || target.statusEffects.length === 0) return;

        for (let i = target.statusEffects.length - 1; i >= 0; i--) {
            const effect = target.statusEffects[i];
            effect.duration -= delta;
            effect.tickTimer += delta;

            // DoT Logic
            if (effect.config.interval && effect.tickTimer >= effect.config.interval) {
                effect.tickTimer = 0;
                const damage = effect.config.damage * effect.stacks;

                // Apply Damage via CombatSystem? Or direct?
                // Direct for now to avoid loops, but should use pipeline.
                // We don't have attacker ref here easily.
                if (target.takeDamage) target.takeDamage(damage);

                // Visual
                this.createDamageNumber(target, damage, effect.type);
            }

            if (effect.duration <= 0) {
                this.removeStatus(target, effect);
                target.statusEffects.splice(i, 1);
            }
        }
    }

    removeStatus(target, effect) {
        if (effect.type === 'freeze') {
            target.speedMultiplier = 1.0;
        }
        if (target.sprite) target.sprite.clearTint();
    }

    createDamageNumber(target, amount, type) {
        const x = target.sprite.x;
        const y = target.sprite.y - 30;
        const color = type === 'burn' ? '#ff0000' : '#ffffff';
        const text = this.scene.add.text(x, y, `-${amount}`, { fontSize: '12px', fill: color });
        this.scene.tweens.add({
            targets: text,
            y: y - 20,
            alpha: 0,
            duration: 500,
            onComplete: () => text.destroy()
        });
    }
}
