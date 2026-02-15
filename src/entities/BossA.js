import EnemyBase from './EnemyBase.js';
import Projectile from './Projectile.js';
import EnemyMelee from './EnemyMelee.js';
import { PHYSICS_CONFIG } from '../config/physicsConfig.js';
import eventBus from '../core/EventBus.js';

export default class BossA extends EnemyBase {
    constructor(scene, x, y) {
        super(scene, x, y, 'boss_main'); // 'boss_main' texture from AssetGenerator
        
        this.stats = {
            hp: 2000,
            maxHp: 2000,
            damage: 25,
            xpReward: 500
        };
        
        this.sprite.body.setSize(96, 96);
        this.sprite.setScale(1.2);
        
        this.phase = 1;
        this.attackCooldown = 2000;
        this.jumpCooldown = 4000;
        this.lastJumpTime = 0;
        
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

    startPhase2() {
        this.phase = 2;
        this.attackCooldown = 1500;
        this.sprite.setTint(0xffff00); // Yellow
        eventBus.emit('boss-phase-change', { phase: 2 });
        // Summon minions
        this.scene.time.addEvent({
            delay: 1000,
            repeat: 2,
            callback: () => {
                new EnemyMelee(this.scene, this.sprite.x + Math.random() * 200 - 100, this.sprite.y - 100);
            }
        });
    }

    startPhase3() {
        this.phase = 3;
        this.attackCooldown = 1000;
        this.sprite.setTint(0xff0000); // Red
        eventBus.emit('boss-phase-change', { phase: 3 });
        // Enrage
        this.moveSpeed *= 1.5;
    }

    attack(time) {
        if (time - this.lastAttackTime < this.attackCooldown) return;
        this.lastAttackTime = time;

        const dist = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, this.target.sprite.x, this.target.sprite.y);

        if (this.phase === 1) {
            if (dist < 100) this.meleeAttack();
            else this.shootProjectile();
        } else if (this.phase >= 2) {
            if (Math.random() > 0.5) this.jumpAttack();
            else this.shootSpread();
        }
    }

    meleeAttack() {
        // Simple punch
        this.scene.tweens.add({
            targets: this.sprite,
            x: this.target.sprite.x,
            duration: 200,
            yoyo: true,
            onYoyo: () => {
                // Hitbox check
                if (Phaser.Geom.Intersects.RectangleToRectangle(this.sprite.getBounds(), this.target.sprite.getBounds())) {
                    this.target.takeDamage(this.stats.damage);
                }
            }
        });
    }

    shootProjectile() {
        const proj = this.projectiles.get(this.sprite.x, this.sprite.y);
        if (proj) {
            proj.setActive(true).setVisible(true);
            proj.fire(this.target.sprite.x, this.target.sprite.y, 400);
        }
    }

    shootSpread() {
        for (let i = -1; i <= 1; i++) {
            const proj = this.projectiles.get(this.sprite.x, this.sprite.y);
            if (proj) {
                proj.setActive(true).setVisible(true);
                proj.fire(this.target.sprite.x + (i * 50), this.target.sprite.y + (i * 50), 350);
            }
        }
    }

    jumpAttack() {
        if (this.scene.time.now - this.lastJumpTime < this.jumpCooldown) return;
        this.lastJumpTime = this.scene.time.now;
        
        this.sprite.setVelocityY(-800);
        this.sprite.setVelocityX((this.target.sprite.x - this.sprite.x) * 2); // Jump towards player
        
        // On land -> shockwave?
        // Need to detect landing. Arcade physics handles landing velocity reset.
        // We can check blocked.down in update.
    }
}
