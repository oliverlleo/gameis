import { COMBAT_CONFIG } from '../config/combatConfig.js';
import StatusSystem from './StatusSystem.js';
import eventBus from '../core/EventBus.js';

export default class SkillSystem {
    constructor(scene) {
        this.scene = scene;
        this.cooldowns = {}; 
        this.statusSystem = new StatusSystem(scene);
    }

    canUse(player, skillId) {
        const config = COMBAT_CONFIG.skills[skillId];
        if (!config) return false;
        if (player.stats.energy < config.cost) return false;
        
        const lastUsed = this.cooldowns[skillId];
        const now = this.scene.time.now;
        if (lastUsed && now - lastUsed < config.cooldown) return false;
        
        return true;
    }

    useSkill(player, skillId, targets) {
        if (!this.canUse(player, skillId)) return false;
        
        const config = COMBAT_CONFIG.skills[skillId];
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
        // Emit for UI Cooldown
        eventBus.emit('cooldown-start', { skill: skillId, duration: config.cooldown });
        return true;
    }

    ascendingRupture(player, config, targets) {
        player.sprite.setVelocityY(config.launchForce);
        this.applyAreaDamage(player, 60, 100, config.damage, 'physical', targets);
        this.createVFX(player.sprite.x, player.sprite.y, 0x0000ff);
    }

    shadowStep(player, config) {
        const dir = player.facingRight ? 1 : -1;
        player.sprite.setVelocityX(dir * 1000);
        player.isInvulnerable = true;
        
        this.scene.time.delayedCall(config.duration, () => {
             player.isInvulnerable = false;
             player.sprite.setVelocityX(0);
        });
        
        // Cleanse
        if (player.statusEffects) {
             player.statusEffects = player.statusEffects.filter(e => e.type !== 'freeze');
        }
    }

    flowBlade(player, config, targets) {
        // Multi hit
        let hits = 0;
        this.scene.time.addEvent({
            delay: 100,
            repeat: config.hits - 1,
            callback: () => {
                hits++;
                const offsetX = player.facingRight ? 40 : -40;
                this.applyAreaDamage(player, 100, 60, config.damage, 'physical', targets, offsetX, 0);
                this.createVFX(player.sprite.x + offsetX, player.sprite.y, 0x00ff00, 0.5);
            }
        });
    }

    freezingPrism(player, config, targets) {
        const offsetX = player.facingRight ? 60 : -60;
        const hitTargets = this.applyAreaDamage(player, 150, 100, config.damage, 'ice', targets, offsetX, 0);
        hitTargets.forEach(t => this.statusSystem.applyStatus(t, 'freeze', config.freezeDuration));
        this.createVFX(player.sprite.x + offsetX, player.sprite.y, 0x00ffff);
    }

    overloadCore(player, config, targets) {
        const hitTargets = this.applyAreaDamage(player, config.radius * 2, config.radius * 2, config.damage, 'lightning', targets);
        hitTargets.forEach(t => this.statusSystem.applyStatus(t, 'shock'));
        this.createVFX(player.sprite.x, player.sprite.y, 0xffff00, 2);
    }

    applyAreaDamage(source, width, height, damage, type, targets, offsetX = 0, offsetY = 0) {
        const hit = [];
        const x = source.sprite.x + offsetX;
        const y = source.sprite.y + offsetY;
        const bounds = new Phaser.Geom.Rectangle(x - width/2, y - height/2, width, height);

        if (targets) {
             targets.forEach(target => {
                if (target && target.sprite && target.sprite.active) {
                    if (Phaser.Geom.Intersects.RectangleToRectangle(bounds, target.sprite.getBounds())) {
                        this.scene.combatSystem.handleHit(source.sprite, target.sprite, damage / 10); // Scale logic needed
                        hit.push(target);
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
