import eventBus from '../core/EventBus.js';

export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene', active: false });
    }

    create() {
        // HP Bar
        this.add.image(20, 20, 'ui_bar_frame').setOrigin(0, 0);
        this.hpFill = this.add.image(22, 22, 'ui_health_fill').setOrigin(0, 0);
        this.hpText = this.add.text(120, 30, '100/100', { fontSize: '12px', fill: '#fff' }).setOrigin(0.5);

        // Energy Bar (Blue)
        this.add.image(20, 50, 'ui_bar_frame').setOrigin(0, 0).setTint(0x0000ff);
        this.energyFill = this.add.image(22, 52, 'ui_health_fill').setOrigin(0, 0).setTint(0x00ffff);
        this.energyText = this.add.text(120, 60, '100/100', { fontSize: '12px', fill: '#fff' }).setOrigin(0.5);

        // XP Bar (Bottom)
        this.xpBar = this.add.rectangle(0, this.scale.height - 10, 0, 10, 0xaa00ff).setOrigin(0, 0);

        // Level
        this.levelText = this.add.text(20, this.scale.height - 40, 'Lvl 1', { fontSize: '20px', fill: '#ffff00' });

        // Gold
        this.goldText = this.add.text(this.scale.width - 150, 20, 'Gold: 0', { fontSize: '24px', fill: '#ffd700' });

        // Listeners
        eventBus.on('player-damaged', this.updateHP, this);
        eventBus.on('xp-updated', this.updateXP, this);
        eventBus.on('level-up', this.handleLevelUp, this);
        eventBus.on('gold-updated', (gold) => this.goldText.setText(`Gold: ${gold}`), this);

        // Initial update?
        // We need initial stats.
        // We can listen for 'game-started' or query game scene?
        // For now, assume initial values are full.
    }

    updateHP(data) {
        const pct = Math.max(0, data.hp / data.maxHp);
        this.hpFill.scaleX = pct;
        this.hpText.setText(`${Math.ceil(data.hp)}/${data.maxHp}`);
    }

    updateXP(data) {
        const pct = Math.max(0, data.current / data.required);
        this.xpBar.width = this.scale.width * pct;
        this.levelText.setText(`Lvl ${data.level}`);
    }

    handleLevelUp(data) {
        this.levelText.setText(`Lvl ${data.level}`);
        // Maybe show level up notification
        const txt = this.add.text(this.scale.width/2, this.scale.height/2, 'LEVEL UP!', { fontSize: '64px', color: '#ffff00', stroke: '#000', strokeThickness: 6 }).setOrigin(0.5);
        this.tweens.add({
            targets: txt,
            scale: 1.5,
            alpha: 0,
            duration: 2000,
            onComplete: () => txt.destroy()
        });
    }
}
