import { aiConfig } from '../config/aiConfig.js';

export class EnemyBase {
  constructor(scene, x, y, type = 'scout') {
    this.scene = scene;
    this.type = type;
    this.state = 'idle';
    this.hp = 60;
    this.cooldown = 0;

    this.sprite = scene.add.rectangle(x, y, 26, 36, 0xff6666);
    scene.physics.add.existing(this.sprite);
    this.sprite.body.setCollideWorldBounds(false);
    this.sprite.setData('entity', this);
  }

  update(dt, player) {
    const d = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, player.x, player.y);
    this.cooldown -= dt;

    if (this.hp <= 0) return this.die();

    if (d < aiConfig.detectRange && this.state === 'idle') this.state = 'chase';

    if (this.state === 'chase') {
      this.sprite.body.setVelocityX(Math.sign(player.x - this.sprite.x) * 90);
      if (d < 72) this.state = 'attack';
    }

    if (this.state === 'attack' && this.cooldown <= 0) {
      this.cooldown = 1100;
      this.state = 'recover';
    }

    if (this.state === 'recover' && this.cooldown < 600) this.state = 'chase';
  }

  hurt(dmg) {
    this.hp -= dmg;
    this.sprite.setFillStyle(0xffffff);
    this.scene.time.delayedCall(60, () => this.sprite?.setFillStyle(0xff6666));
  }

  die() {
    this.scene.systemsBag?.prog.onEnemyDefeated(this);
    this.sprite.destroy();
  }
}
