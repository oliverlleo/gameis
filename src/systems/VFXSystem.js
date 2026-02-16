export default class VFXSystem {
  constructor(scene) {
    this.scene = scene;
    this.intensity = 1;
    this.shakeStrength = 0.55;
    this.reducedFlashes = false;
    this.warnObjects = [];
  }

  init() {}

  setIntensity(v) { this.intensity = Phaser.Math.Clamp(v, 0, 1); }
  setShakeStrength(v) { this.shakeStrength = Phaser.Math.Clamp(v, 0, 1); }
  setReducedFlashes(v) { this.reducedFlashes = !!v; }

  hitSpark(x, y, color = 0xffffff) {
    const count = Math.round(8 * this.intensity);
    for (let i = 0; i < count; i++) {
      const p = this.scene.add.rectangle(x, y, 3, 3, color, 1).setDepth(200);
      this.scene.tweens.add({
        targets: p,
        x: x + Phaser.Math.Between(-28, 28),
        y: y + Phaser.Math.Between(-28, 28),
        alpha: 0,
        scale: 0.2,
        duration: Phaser.Math.Between(140, 220),
        onComplete: () => p.destroy()
      });
    }
    this.screenShake(80, 0.0024);
  }

  hitFlash(target) {
    if (this.reducedFlashes) return;
    target.setTint(0xffffff);
    this.scene.time.delayedCall(40, () => target.clearTint());
  }

  slashArc(x, y, dir = 1, radius = 110, thickness = 80, color = 0xdfffff) {
    const g = this.scene.add.graphics().setDepth(190);
    g.lineStyle(3, color, 0.95);
    const start = dir > 0 ? -0.8 : 2.35;
    const end = dir > 0 ? 0.8 : 3.95;
    g.strokePoints(Phaser.Geom.Circle.CircumferencePoint({x, y, radius}, start), false);
    g.beginPath();
    g.arc(x, y, radius, start, end, false);
    g.strokePath();
    this.scene.tweens.add({
      targets: g,
      alpha: 0,
      duration: 120,
      onComplete: () => g.destroy()
    });
  }

  explosion(x, y, radius = 100, color = 0xffffff) {
    const ring = this.scene.add.circle(x, y, 20, color, this.reducedFlashes ? 0.28 : 0.46).setDepth(198);
    this.scene.tweens.add({
      targets: ring,
      radius: radius,
      alpha: 0,
      duration: 280,
      ease: 'Quad.easeOut',
      onComplete: () => ring.destroy()
    });
    this.screenShake(140, 0.0042);
  }

  warnCircle(x, y, radius = 80, ms = 220) {
    const c = this.scene.add.circle(x, y, radius, 0xff8a8a, 0.18).setDepth(150);
    c.setStrokeStyle(2, 0xff6666, 0.9);
    this.warnObjects.push(c);
    this.scene.time.delayedCall(ms, () => {
      c.destroy();
    });
  }

  phaseBurst(x, y, phase) {
    this.explosion(x, y, 120 + phase * 25, 0xffd7a8);
  }

  levelUpBurst(x, y) {
    this.explosion(x, y, 130, 0xb8ffd3);
  }

  afterImage(x, y, color = 0xbfd7ff) {
    const r = this.scene.add.rectangle(x, y, 20, 30, color, 0.4).setDepth(185);
    this.scene.tweens.add({
      targets: r,
      alpha: 0,
      x: x + Phaser.Math.Between(-16, 16),
      duration: 180,
      onComplete: () => r.destroy()
    });
  }

  markTarget(target) {
    const ring = this.scene.add.circle(target.x, target.y - 24, 18, 0xff98ff, 0).setDepth(210);
    ring.setStrokeStyle(2, 0xff98ff, 0.9);
    const upd = () => {
      if (!target.active) {
        ring.destroy();
        this.scene.events.off('update', upd);
        return;
      }
      ring.setPosition(target.x, target.y - 24);
    };
    this.scene.events.on('update', upd);
    this.scene.time.delayedCall(600, () => {
      ring.destroy();
      this.scene.events.off('update', upd);
    });
  }

  flash(kind = 'default') {
    if (this.reducedFlashes) return;
    const alpha = kind.includes('boss') ? 0.25 : 0.18;
    const overlay = this.scene.add.rectangle(
      this.scene.cameras.main.worldView.centerX,
      this.scene.cameras.main.worldView.centerY,
      this.scene.scale.width,
      this.scene.scale.height,
      kind === 'fall-safe' ? 0x88bbff : 0xffffff,
      alpha
    ).setScrollFactor(0).setDepth(500);
    this.scene.tweens.add({ targets: overlay, alpha: 0, duration: 120, onComplete: () => overlay.destroy() });
  }

  screenShake(ms = 100, intensity = 0.002) {
    const i = intensity * this.shakeStrength * this.intensity;
    if (i <= 0) return;
    this.scene.cameras.main.shake(ms, i, true);
  }

  update() {
    // cleanup orphaned warnings
    this.warnObjects = this.warnObjects.filter((w) => w.active);
  }
}
