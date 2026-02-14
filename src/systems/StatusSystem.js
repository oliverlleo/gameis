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

        // Check if exists
        const existing = target.statusEffects.find(e => e.type === type);
        if (existing) {
            existing.duration = duration; // Refresh
            if (config.stackable) existing.stacks = (existing.stacks || 1) + 1;
        } else {
            target.statusEffects.push({
                type: type,
                duration: duration,
                timer: 0,
                tickTimer: 0,
                stacks: 1,
                config: config
            });

            // Initial effect (e.g. slow)
            if (type === 'freeze') {
                if (target.body) target.body.velocity.x *= config.slow; // Instant slow? No, modify movement logic
                // Better: Set a flag on target "isFrozen" or "moveSpeedMultiplier"
                target.speedMultiplier = config.slow;
            }
        }

        // Visual feedback
        this.createStatusVFX(target, type);
    }

    update(target, delta) {
        if (!target.statusEffects || target.statusEffects.length === 0) return;

        for (let i = target.statusEffects.length - 1; i >= 0; i--) {
            const effect = target.statusEffects[i];
            effect.duration -= delta;
            effect.tickTimer += delta;

            // Handle DoT
            if (effect.config.interval && effect.tickTimer >= effect.config.interval) {
                effect.tickTimer = 0;
                const damage = effect.config.damage * effect.stacks;
                eventBus.emit('damage-event', { target: target, amount: damage, type: effect.type, isDoT: true });
                this.createDamageNumber(target, damage, effect.type);
            }

            // Remove expired
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
    }

    createStatusVFX(target, type) {
        // Simple particle or tint
        if (type === 'burn') target.sprite.setTint(0xff0000);
        if (type === 'freeze') target.sprite.setTint(0x00ffff);
        if (type === 'shock') target.sprite.setTint(0xffff00);

        // Reset tint after a bit? No, tint persists with status.
        // Status removal should clear tint.
        // But multiple statuses?
        // Let's just tint for the last applied for now.
    }

    createDamageNumber(target, amount, type) {
        // Text popup
        const x = target.sprite.x;
        const y = target.sprite.y - 30;
        const color = type === 'burn' ? '#ff0000' : '#ffffff';
        const text = this.scene.add.text(x, y, `-${amount}`, { fontSize: '16px', fill: color, stroke: '#000', strokeThickness: 2 });
        this.scene.tweens.add({
            targets: text,
            y: y - 30,
            alpha: 0,
            duration: 800,
            onComplete: () => text.destroy()
        });
    }
}
