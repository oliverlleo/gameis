import { aiConfig } from '../config/aiConfig.js';

export class EnemyBase {
  constructor(scene, x, y, config = {}) {
    this.scene = scene;
    this.type = config.type || 'scout';
    this.role = config.role || 'melee';
    this.state = 'idle';
    this.hp = config.hp ?? 70;
    this.maxHp = this.hp;
    this.damage = config.damage ?? 10;
    this.speed = config.speed ?? 90;
    this.attackRange = config.attackRange ?? 72;
    this.color = config.color ?? 0xff6666;
    this.cooldown = 0;
    this.recoverAt = 0;

    this.sprite = scene.add.rectangle(x, y, 26, 36, this.color);
    scene.physics.add.existing(this.sprite);
    this.sprite.body.setCollideWorldBounds(false);
    this.sprite.setData('entity', this);
  }

  update(dt, player) {
    const now = this.scene.time.now;
    const d = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, player.x, player.y);
    this.cooldown -= dt;

    if (this.hp <= 0) return this.die();

    if (this.state === 'idle' && d < aiConfig.detectRange) this.state = 'detect';
    if (this.state === 'detect') this.state = 'chase';

    if (this.state === 'chase') {
      const dir = Math.sign(player.x - this.sprite.x);
      this.sprite.body.setVelocityX(dir * this.speed);
      if (d <= this.attackRange) {
        this.state = 'attack';
      }
      if (this.hp / this.maxHp < aiConfig.retreatThreshold && this.role !== 'tank') this.state = 'retreat';
    }

    if (this.state === 'attack' && this.cooldown <= 0) {
      this.performAttack(player);
      this.cooldown = this.role === 'assassin' ? 650 : 950;
      this.recoverAt = now + 250;
      this.state = 'recover';
    }

    if (this.state === 'recover' && now >= this.recoverAt) this.state = 'chase';

    if (this.state === 'retreat') {
      const dir = Math.sign(this.sprite.x - player.x);
      this.sprite.body.setVelocityX(dir * (this.speed * 0.8));
      if (d > this.attackRange * 2) this.state = 'chase';
    }
  }

  performAttack(player) {
    const dir = Math.sign(player.x - this.sprite.x);
    this.sprite.body.setVelocityX(dir * this.speed * 0.4);
    if (Math.abs(this.sprite.x - player.x) < this.attackRange + 8 && Math.abs(this.sprite.y - player.y) < 38) {
      this.scene.player.applyDamage(this.damage, dir * 80);
    }
  }

  hurt(dmg) {
    this.hp -= dmg;
    this.sprite.setFillStyle(0xffffff);
    this.scene.time.delayedCall(50, () => this.sprite?.setFillStyle(this.color));
  }

  die() {
    this.scene.systemsBag?.prog.onEnemyDefeated(this);
    this.sprite.destroy();
  }
}
