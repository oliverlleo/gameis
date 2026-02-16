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

        // Cooldowns (Bottom Right)
        this.skillIcons = [];
        for(let i=0; i<5; i++) {
            const x = this.scale.width - 200 + (i * 40);
            const y = this.scale.height - 50;
            const bg = this.add.rectangle(x, y, 32, 32, 0x333333).setOrigin(0.5);
            const text = this.add.text(x, y, `${i+1}`, { fontSize: '12px', fill: '#fff' }).setOrigin(0.5);
            const overlay = this.add.rectangle(x, y, 32, 32, 0x000000, 0.7).setOrigin(0.5).setVisible(false);
            
            this.skillIcons.push({ bg, text, overlay, timer: 0, max: 0 });
        }

        // Listeners
        this.goldHandler = (gold) => this.goldText.setText(`Gold: ${gold}`);
        
        eventBus.on('player-damaged', this.updateHP, this);
        eventBus.on('player-healed', this.updateHP, this);
        eventBus.on('xp-updated', this.updateXP, this);
        eventBus.on('level-up', this.handleLevelUp, this);
        eventBus.on('gold-updated', this.goldHandler);
        eventBus.on('cooldown-start', this.startCooldown, this);
        
        this.events.once('shutdown', this.shutdown, this);

        // Settings Button
        const settingsBtn = this.add.text(this.scale.width - 80, 60, 'OPTS', { fontSize: '16px', fill: '#aaa' })
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.pause('GameScene');
                this.scene.launch('SettingsScene');
            });
    }

    update(time, delta) {
        // Update Cooldowns
        this.skillIcons.forEach(icon => {
            if (icon.timer > 0) {
                icon.timer -= delta;
                const pct = icon.timer / icon.max;
                icon.overlay.height = 32 * pct;
                icon.overlay.setVisible(true);
            } else {
                icon.overlay.setVisible(false);
            }
        });
    }

    startCooldown(data) {
        // Map skill ID to index
        const map = { 'ascendingRupture': 0, 'shadowStep': 1, 'flowBlade': 2, 'freezingPrism': 3, 'overloadCore': 4 };
        const idx = map[data.skill];
        if (idx !== undefined) {
            const icon = this.skillIcons[idx];
            icon.timer = data.duration;
            icon.max = data.duration;
        }
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
        const txt = this.add.text(this.scale.width/2, this.scale.height/2, 'LEVEL UP!', { fontSize: '64px', color: '#ffff00', stroke: '#000', strokeThickness: 6 }).setOrigin(0.5);
        this.tweens.add({
            targets: txt,
            scale: 1.5,
            alpha: 0,
            duration: 2000,
            onComplete: () => txt.destroy()
        });
    }

    shutdown() {
        eventBus.off('player-damaged', this.updateHP, this);
        eventBus.off('player-healed', this.updateHP, this);
        eventBus.off('xp-updated', this.updateXP, this);
        eventBus.off('level-up', this.handleLevelUp, this);
        eventBus.off('gold-updated', this.goldHandler);
        eventBus.off('cooldown-start', this.startCooldown, this);
    }
}
