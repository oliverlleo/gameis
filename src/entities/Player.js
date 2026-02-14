import { physicsConfig } from '../config/physicsConfig.js';
import { combatConfig } from '../config/combatConfig.js';

export class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, null).setDisplaySize(28, 42).setTint(0x55aaff).setCollideWorldBounds(false);
    this.sprite.body.setSize(20, 36);
    this.attackHitbox = scene.physics.add.sprite(x, y, null).setVisible(false);
    this.attackHitbox.body.setAllowGravity(false);
    this.facing = 1; this.combo = 0; this.attackLock = 0; this.hp = 220; this.energy = 100; this.lastGroundedAt = 0; this.jumpQueuedAt = 0;
    this.keys = scene.input.keyboard.addKeys('W,A,S,D,SPACE,J,K,L,I,O,P,F3,ESC,ONE,TWO,THREE,FOUR,FIVE');
  }
  onGround() { return this.sprite.body.blocked.down; }
  update(dt) {
    const t = this.scene.time.now;
    const body = this.sprite.body;
    if (this.onGround()) this.lastGroundedAt = t;
    const left = this.keys.A.isDown, right = this.keys.D.isDown;
    if (left || right) {
      const dir = left ? -1 : 1; this.facing = dir;
      body.velocity.x += dir * physicsConfig.acceleration * (dt/1000);
      body.velocity.x = Phaser.Math.Clamp(body.velocity.x, -physicsConfig.maxHorizontalSpeed, physicsConfig.maxHorizontalSpeed);
    } else {
      body.velocity.x = Phaser.Math.MoveTowards(body.velocity.x, 0, physicsConfig.deceleration * (dt/1000));
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) this.jumpQueuedAt = t;
    const canCoyote = t - this.lastGroundedAt <= physicsConfig.coyoteMs;
    const hasBuffer = t - this.jumpQueuedAt <= physicsConfig.jumpBufferMs;
    if ((this.onGround() || canCoyote) && hasBuffer) { body.velocity.y = physicsConfig.jumpVelocity; this.jumpQueuedAt = -9999; }
    if (Phaser.Input.Keyboard.JustUp(this.keys.SPACE) && body.velocity.y < 0) body.velocity.y *= 0.65;
    if (body.velocity.y > 0) body.velocity.y = Math.min(body.velocity.y * physicsConfig.fallMultiplier, physicsConfig.maxFallSpeed);
    if (this.sprite.y > physicsConfig.worldBounds.yMax) { this.sprite.setPosition(this.scene.cameras.main.scrollX + 120, 300); this.hp = Math.max(1, this.hp - 25); }
    this.handleAttack(dt);
    this.attackHitbox.setPosition(this.sprite.x + this.facing * 24, this.sprite.y);
  }
  handleAttack(dt) {
    if (this.attackLock > 0) { this.attackLock -= dt; return; }
    const pressed = Phaser.Input.Keyboard.JustDown(this.keys.J);
    const heavy = Phaser.Input.Keyboard.JustDown(this.keys.K);
    if (pressed) { this.combo = (this.combo % 3) + 1; this.doAttack(`light${this.combo}`); }
    if (heavy) this.doAttack('heavy');
  }
  doAttack(name) {
    const frame = combatConfig.frameData[name];
    this.attackLock = (frame.startup + frame.active + frame.recovery) * (1000/60);
    this.scene.time.delayedCall(frame.startup * (1000/60), () => { this.attackHitbox.body.enable = true; });
    this.scene.time.delayedCall((frame.startup + frame.active) * (1000/60), () => { this.attackHitbox.body.enable = false; });
    this.currentAttack = name;
  }
  getAttackData() { return { name: this.currentAttack || 'light1', combo: this.combo }; }
}
