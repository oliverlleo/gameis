import { physicsConfig } from '../config/physicsConfig.js';

function approach(current, target, delta) {
  if (current < target) return Math.min(target, current + delta);
  if (current > target) return Math.max(target, current - delta);
  return target;
}

export default class MovementSystem {
  constructor(scene) {
    this.scene = scene;
  }

  update(deltaMs, now) {
    const s = this.scene.state;
    const player = s.player;
    if (!player || !player.active || !player.isAlive()) return;

    const input = this.scene.systemsRef.input;
    const pconf = physicsConfig;
    const body = player.body;
    const dt = deltaMs / 1000;

    player.grounded = body.blocked.down || body.touching.down;
    if (player.grounded) player.lastGroundedAt = now;

    const axisX = input.getAxisX();
    const targetVx = axisX * pconf.maxHorizontalSpeed;
    const accel = Math.abs(axisX) > 0 ? pconf.acceleration : pconf.braking;
    body.velocity.x = approach(body.velocity.x, targetVx, accel * dt);

    if (axisX !== 0 && !player.isCasting) {
      player.facing = axisX > 0 ? 1 : -1;
      player.setFlipX(player.facing < 0);
    }

    if (input.pressed('jump')) player.pressJump(now);

    const jumpBuffered = (now - player.lastJumpPressAt) <= pconf.jump.bufferMs;
    const coyote = (now - player.lastGroundedAt) <= pconf.jump.coyoteMs;
    if (jumpBuffered && coyote && !player.isCasting) {
      body.velocity.y = pconf.jump.velocity;
      player.lastJumpPressAt = -9999;
      player.lastGroundedAt = -9999;
      this.scene.systemsRef.audio.play('jump');
    }

    const vy = body.velocity.y;
    if (!input.down('jump') && vy < 0) {
      body.velocity.y += pconf.gravity * (pconf.jump.jumpCutGravityMultiplier - 1) * dt;
    } else if (vy > 0) {
      body.velocity.y += pconf.gravity * (pconf.jump.fallMultiplier - 1) * dt;
    }
    body.velocity.y = Math.min(body.velocity.y, pconf.jump.maxFallSpeed);

    if (player.y > this.scene.config.world.worldFallY) {
      const penalty = Math.max(12, Math.round(player.maxHp * 0.08));
      player.hp = Math.max(1, player.hp - penalty);
      player.x = this.scene.cameras.main.worldView.x + this.scene.config.world.safeRespawnXOffset;
      player.y = this.scene.config.world.startY - 40;
      body.stop();
      this.scene.systemsRef.vfx.flash('fall-safe');
      this.scene.systemsRef.ui.toast(`Fail-safe respawn: -${penalty} HP`);
    }

    player.updateFacingFromVelocity();
    player.distance = Math.max(player.distance, Math.floor((player.x - this.scene.config.world.startX) / 10));
    player.updateVitals(dt);
  }
}
