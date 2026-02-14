import { COMBAT_CONFIG } from '../config/combatConfig.js';
import StatusSystem from './StatusSystem.js';
import eventBus from '../core/EventBus.js';

export default class SkillSystem {
    constructor(scene) {
        this.scene = scene;
        this.cooldowns = {}; // { skillId: timestamp }
        this.statusSystem = new StatusSystem(scene);
    }

    canUse(player, skillId) {
        const config = COMBAT_CONFIG.skills[skillId];
        if (!config) return false;

        // Cost Check
        if (player.stats.energy < config.cost) return false;

        // Cooldown Check
        const lastUsed = this.cooldowns[skillId];
        if (lastUsed === undefined) return true; // Never used, ready

        const now = this.scene.time.now;
        if (now - lastUsed < config.cooldown) return false;

        return true;
    }

    useSkill(player, skillId, targets) {
        if (!this.canUse(player, skillId)) return false;

        const config = COMBAT_CONFIG.skills[skillId];

        // Consume Cost
        player.stats.energy -= config.cost;
        this.cooldowns[skillId] = this.scene.time.now;

        // Execute Logic
        switch(skillId) {
            case 'ascendingRupture':
                this.ascendingRupture(player, config, targets);
                break;
            case 'shadowStep':
                this.shadowStep(player, config);
                break;
            case 'flowBlade':
                this.flowBlade(player, config, targets);
                break;
            case 'freezingPrism':
                this.freezingPrism(player, config, targets);
                break;
            case 'overloadCore':
                this.overloadCore(player, config, targets);
                break;
        }

        eventBus.emit('skill-used', { skill: skillId, player: player });
        return true;
    }

    ascendingRupture(player, config, targets) {
        player.sprite.setVelocityY(config.launchForce);
        this.applyAreaDamage(player, 60, 100, config.damage, 'physical', targets);
        this.createVFX(player.sprite.x, player.sprite.y, 0x0000ff);
    }

    shadowStep(player, config) {
        const dir = player.facingRight ? 1 : -1;
        // Simple teleport with bounds check?
        // Let's just add velocity or tween position to be safe with collisions
        // But prompt says "intangible dash".
        // Teleport is safest for now, but might clip walls.
        // We'll trust the "anti-tunneling" logic or just use physics.
        // Let's set velocity high for a short duration instead.
        player.sprite.setVelocityX(dir * 1000); // Fast dash
        player.sprite.body.checkCollision.none = true; // Intangible

        this.scene.time.delayedCall(config.duration, () => {
             player.sprite.body.checkCollision.none = false;
             player.sprite.setVelocityX(0);
        });

        // Cleanse slow
        if (player.statusEffects) {
             player.statusEffects = player.statusEffects.filter(e => e.type !== 'freeze');
             player.speedMultiplier = 1.0;
        }
    }

    flowBlade(player, config, targets) {
        let hits = 0;
        const interval = this.scene.time.addEvent({
            delay: 100,
            repeat: config.hits - 1,
            callback: () => {
                hits++;
                // Offset hitbox based on facing
                const offsetX = player.facingRight ? 40 : -40;
                this.applyAreaDamage(player, 100, 60, config.damage, 'physical', targets, offsetX, 0);
                this.createVFX(player.sprite.x + offsetX, player.sprite.y, 0x00ff00, 0.5);
            }
        });
    }

    freezingPrism(player, config, targets) {
        // Cone or area
        const offsetX = player.facingRight ? 60 : -60;
        const hitTargets = this.applyAreaDamage(player, 150, 100, config.damage, 'ice', targets, offsetX, 0);

        // Status System handles application? Or we call it directly?
        // Wait, SkillSystem constructor creates new StatusSystem.
        // We can reuse it.
        hitTargets.forEach(t => this.statusSystem.applyStatus(t, 'freeze', config.freezeDuration));
        this.createVFX(player.sprite.x + offsetX, player.sprite.y, 0x00ffff);
    }

    overloadCore(player, config, targets) {
        // Big AoE
        const hitTargets = this.applyAreaDamage(player, config.radius * 2, config.radius * 2, config.damage, 'lightning', targets, 0, 0);
        hitTargets.forEach(t => this.statusSystem.applyStatus(t, 'shock'));
        this.createVFX(player.sprite.x, player.sprite.y, 0xffff00, 2);
    }

    applyAreaDamage(source, width, height, damage, type, targets, offsetX = 0, offsetY = 0) {
        const hit = [];
        const x = source.sprite.x + offsetX;
        const y = source.sprite.y + offsetY;

        // Visual debug
        // const g = this.scene.add.rectangle(x, y, width, height, 0xff0000, 0.2);
        // this.scene.time.delayedCall(100, () => g.destroy());

        const bounds = new Phaser.Geom.Rectangle(x - width/2, y - height/2, width, height);

        if (Array.isArray(targets)) {
             targets.forEach(target => {
                if (target && target.sprite && target.sprite.active) {
                    if (Phaser.Geom.Intersects.RectangleToRectangle(bounds, target.sprite.getBounds())) {
                        // Apply damage logic
                        // If target has takeDamage method
                        if (target.takeDamage) {
                            target.takeDamage(damage);
                            hit.push(target);
                            eventBus.emit('enemy-damaged', { target: target, amount: damage, type: type });
                        }
                    }
                }
            });
        }
        return hit;
    }

    createVFX(x, y, color, scale=1) {
        const circle = this.scene.add.circle(x, y, 20 * scale, color);
        this.scene.tweens.add({
            targets: circle,
            alpha: 0,
            scale: 2 * scale,
            duration: 300,
            onComplete: () => circle.destroy()
        });
    }
}
