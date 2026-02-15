import { PROGRESSION_CONFIG } from '../config/progressionConfig.js';
import eventBus from '../core/EventBus.js';

export default class ProgressionSystem {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.level = 1;
        this.currentXP = 0;
        this.xpToNext = PROGRESSION_CONFIG.getXPForLevel(1);
        
        // Listen to XP events
        eventBus.on('enemy-died', this.handleEnemyDeath, this);
    }

    handleEnemyDeath(data) {
        this.addXP(data.xp);
        // Also trigger loot? 
    }

    addXP(amount) {
        this.currentXP += amount;
        
        // Check level up
        while (this.currentXP >= this.xpToNext && this.level < PROGRESSION_CONFIG.maxLevel) {
            this.currentXP -= this.xpToNext;
            this.levelUp();
        }
        
        eventBus.emit('xp-updated', { current: this.currentXP, required: this.xpToNext, level: this.level });
    }

    levelUp() {
        this.level++;
        this.xpToNext = PROGRESSION_CONFIG.getXPForLevel(this.level);
        
        // Stat Growth
        const growth = PROGRESSION_CONFIG.statGrowth;
        this.player.stats.maxHp += growth.hp;
        this.player.stats.hp = this.player.stats.maxHp; // Full heal on level up?
        this.player.stats.maxEnergy += growth.energy;
        this.player.stats.energy = this.player.stats.maxEnergy;
        
        // Need to add damage/defense to player stats
        if (!this.player.stats.damage) this.player.stats.damage = 10;
        this.player.stats.damage += growth.damage;
        this.player.stats.defense += growth.defense;
        
        eventBus.emit('level-up', { level: this.level, stats: this.player.stats });
        this.createLevelUpVFX();
    }
    
    createLevelUpVFX() {
        const x = this.player.sprite.x;
        const y = this.player.sprite.y;
        
        const text = this.scene.add.text(x, y - 50, 'LEVEL UP!', { 
            fontSize: '24px', 
            fill: '#ffff00', 
            stroke: '#000', 
            strokeThickness: 4 
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: y - 100,
            alpha: 0,
            duration: 2000,
            onComplete: () => text.destroy()
        });
        
        // Sound
        if (this.scene.audioSystem) this.scene.audioSystem.playSound('powerup');
    }
}
