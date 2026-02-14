import { physicsConfig } from '../config/physicsConfig.js';
export class MovementSystem {
  constructor(scene){ this.scene=scene; }
  update(dt){
    const { player:p, systemsMap:{input} } = this.scene;
    const k = input.keys; if (!k) return;
    const ax = (k.left.isDown?-1:0) + (k.right.isDown?1:0);
    if (ax !== 0) { p.setAccelerationX(ax*physicsConfig.acceleration); p.facing=ax; }
    else {
      p.setAccelerationX(0);
      const decel = physicsConfig.deceleration*dt;
      if (Math.abs(p.body.velocity.x)<=decel) p.setVelocityX(0); else p.setVelocityX(p.body.velocity.x-Math.sign(p.body.velocity.x)*decel);
    }
    p.body.velocity.x = Phaser.Math.Clamp(p.body.velocity.x, -physicsConfig.maxHorizontalSpeed, physicsConfig.maxHorizontalSpeed);
    if (p.body.onFloor()) p.lastGroundedAt = performance.now();
    const canCoyote = performance.now()-p.lastGroundedAt <= physicsConfig.coyoteTimeMs;
    const buffered = performance.now()-p.lastJumpPressAt <= physicsConfig.jumpBufferMs;
    if (buffered && canCoyote) { p.setVelocityY(physicsConfig.jumpVelocity); p.lastJumpPressAt=-9999; }
    if (!k.jump.isDown && p.body.velocity.y < 0) p.body.velocity.y += physicsConfig.gravity * (physicsConfig.jumpCutGravityMultiplier-1) * dt;
    if (p.body.velocity.y > 0) p.body.velocity.y += physicsConfig.gravity * (physicsConfig.fallMultiplier-1) * dt;
    p.body.velocity.y = Math.min(p.body.velocity.y, physicsConfig.maxFallSpeed);
  }
}
