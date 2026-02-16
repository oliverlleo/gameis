export default class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture = 'proj_enemy') {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setActive(false).setVisible(false);
    this.body.enable = false;
    this.owner = 'enemy';
    this.damage = 1;
    this.damageType = 'physical';
    this.speed = 420;
    this.expiresAt = 0;
    this.pierce = 0;
    this.onHit = null;
    this.setDepth(17);
  }

  fire(x, y, vx, vy, opts = {}, now = performance.now()) {
    this.setPosition(x, y);
    this.setActive(true).setVisible(true);
    this.body.enable = true;
    this.body.setAllowGravity(false);
    this.body.setVelocity(vx, vy);
    this.owner = opts.owner || 'enemy';
    this.damage = opts.damage ?? 10;
    this.damageType = opts.damageType || 'physical';
    this.speed = Math.hypot(vx, vy);
    this.expiresAt = now + (opts.lifeMs || 2200);
    this.pierce = opts.pierce || 0;
    this.onHit = opts.onHit || null;
    this.setTint(opts.tint || 0xffffff);
  }

  recycle() {
    this.setActive(false).setVisible(false);
    this.body.enable = false;
    this.body.stop();
    this.onHit = null;
  }

  update(now) {
    if (!this.active) return;
    if (now >= this.expiresAt) this.recycle();
  }
}
