import { physicsConfig } from '../config/physicsConfig.js';
import { combatConfig } from '../config/combatConfig.js';

function moveTowards(current, target, maxDelta) {
  if (Math.abs(target - current) <= maxDelta) return target;
  return current + Math.sign(target - current) * maxDelta;
}

export class Player {
  constructor(scene, x, y) {
    this.scene = scene;

    this.sprite = scene.add.rectangle(x, y, 28, 42, 0x55aaff);
    scene.physics.add.existing(this.sprite);
    this.sprite.body.setSize(20, 36);

    this.attackHitbox = scene.add.rectangle(x, y, 30, 24, 0xffffff, 0.001);
    scene.physics.add.existing(this.attackHitbox);
    this.attackHitbox.body.setAllowGravity(false);
    this.attackHitbox.body.enable = false;

    this.facing = 1;
    this.combo = 0;
    this.attackLock = 0;
    this.hp = 220;
    this.maxHp = 220;
    this.energy = 100;
    this.maxEnergy = 100;
    this.lastGroundedAt = 0;
    this.jumpQueuedAt = -9999;
    this.iFrameUntil = 0;

    this.keys = scene.input.keyboard.addKeys('W,A,S,D,SPACE,J,K,F3,ESC,ONE,TWO,THREE,FOUR,FIVE');
  }

  onGround() { return this.sprite.body.blocked.down; }

  applyDamage(amount, knockbackX = 0) {
    const now = this.scene.time.now;
    if (now < this.iFrameUntil) return;
    this.iFrameUntil = now + physicsConfig.playerIFrameMs;
    this.hp = Math.max(0, this.hp - amount);
    this.sprite.body.velocity.x = Phaser.Math.Clamp(knockbackX, -physicsConfig.knockbackCap.x, physicsConfig.knockbackCap.x);
    this.scene.cameras.main.shake(90, 0.003);
    this.sprite.setFillStyle(0xffffff);
    this.scene.time.delayedCall(90, () => this.sprite?.setFillStyle(0x55aaff));
  }

  update(dt) {
    const t = this.scene.time.now;
    const body = this.sprite.body;
    const deltaSec = dt / 1000;

    if (this.onGround()) this.lastGroundedAt = t;

    const left = this.keys.A.isDown;
    const right = this.keys.D.isDown;
    if (left || right) {
      const dir = left ? -1 : 1;
      this.facing = dir;
      body.velocity.x += dir * physicsConfig.acceleration * deltaSec;
      body.velocity.x = Phaser.Math.Clamp(body.velocity.x, -physicsConfig.maxHorizontalSpeed, physicsConfig.maxHorizontalSpeed);
    } else {
      body.velocity.x = moveTowards(body.velocity.x, 0, physicsConfig.deceleration * deltaSec);
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) this.jumpQueuedAt = t;
    const canCoyote = t - this.lastGroundedAt <= physicsConfig.coyoteMs;
    const hasBuffer = t - this.jumpQueuedAt <= physicsConfig.jumpBufferMs;
    if ((this.onGround() || canCoyote) && hasBuffer) {
      body.velocity.y = physicsConfig.jumpVelocity;
      this.jumpQueuedAt = -9999;
    }

    if (Phaser.Input.Keyboard.JustUp(this.keys.SPACE) && body.velocity.y < 0) body.velocity.y *= 0.65;
    if (body.velocity.y > 0) body.velocity.y = Math.min(body.velocity.y * physicsConfig.fallMultiplier, physicsConfig.maxFallSpeed);

    this.energy = Math.min(this.maxEnergy, this.energy + 8 * deltaSec);

    if (this.sprite.y > physicsConfig.worldBounds.yMax) {
      this.sprite.setPosition(this.scene.cameras.main.scrollX + 120, 300);
      body.setVelocity(0, 0);
      this.applyDamage(25, 0);
    }

    this.handleAttack(dt);
    this.attackHitbox.setPosition(this.sprite.x + this.facing * 24, this.sprite.y);
  }

  handleAttack(dt) {
    if (this.attackLock > 0) { this.attackLock -= dt; return; }
    if (Phaser.Input.Keyboard.JustDown(this.keys.J)) {
      this.combo = (this.combo % 3) + 1;
      this.doAttack(`light${this.combo}`);
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.K)) this.doAttack('heavy');
  }

  doAttack(name) {
    const frame = combatConfig.frameData[name];
    this.attackLock = (frame.startup + frame.active + frame.recovery) * (1000 / 60);
    this.scene.time.delayedCall(frame.startup * (1000 / 60), () => { if (this.attackHitbox.body) this.attackHitbox.body.enable = true; });
    this.scene.time.delayedCall((frame.startup + frame.active) * (1000 / 60), () => { if (this.attackHitbox.body) this.attackHitbox.body.enable = false; });
    this.currentAttack = name;
  }

  getAttackData() { return { name: this.currentAttack || 'light1', combo: this.combo }; }
}
