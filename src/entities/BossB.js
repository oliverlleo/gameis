import EnemyBase from './EnemyBase.js';
import Projectile from './Projectile.js';
import eventBus from '../core/EventBus.js';

export default class BossB extends EnemyBase {
    constructor(scene, x, y) {
        super(scene, x, y, 'boss_main');
        this.sprite.setTint(0x00ffff); // Cyan
        this.stats = { hp: 3000, maxHp: 3000, damage: 35, xpReward: 1000 };
        this.sprite.body.setSize(96, 96);
        this.sprite.body.setAllowGravity(false); // Floating

        this.phase = 1;
        this.teleportCooldown = 3000;
        this.laserCooldown = 2000;

        this.projectiles = scene.physics.add.group({ classType: Projectile });
    }

    update(time, delta) {
        super.update(time, delta);

        const hpPercent = this.stats.hp / this.stats.maxHp;

        if (this.phase === 1 && hpPercent < 0.7) {
            this.startPhase2();
        } else if (this.phase === 2 && hpPercent < 0.35) {
            this.startPhase3();
        }
    }

    handleMovement(delta) {
        // Floating Sine movement
        this.sprite.setVelocityY(Math.sin(this.scene.time.now * 0.002) * 50);
        // Slowly drift towards player X
        const dx = this.target.sprite.x - this.sprite.x;
        this.sprite.setVelocityX(dx * 0.5);
    }

    startPhase2() {
        this.phase = 2;
        this.teleportCooldown = 2000;
        this.sprite.setTint(0x0000ff); // Dark Blue
        eventBus.emit('boss-phase-change', { phase: 2 });
    }

    startPhase3() {
        this.phase = 3;
        this.teleportCooldown = 1000;
        this.sprite.setTint(0xff00ff); // Magenta
        eventBus.emit('boss-phase-change', { phase: 3 });
    }

    attack(time) {
        if (time - this.lastAttackTime < this.teleportCooldown) return;
        this.lastAttackTime = time;

        // Teleport
        const targetX = this.target.sprite.x + (Math.random() > 0.5 ? 200 : -200);
        this.sprite.x = targetX;
        this.sprite.y = this.target.sprite.y - 100;

        // Shoot Laser
        this.shootLaser();
    }

    shootLaser() {
        const proj = this.projectiles.get(this.sprite.x, this.sprite.y);
        if (proj) {
            proj.setActive(true).setVisible(true);
            proj.fire(this.target.sprite.x, this.target.sprite.y, 600);
            proj.setTint(0x00ffff);
            proj.damage = 25; // Override
        }
    }
}
