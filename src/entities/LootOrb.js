import { RARITY_COLORS } from '../core/Constants.js';

export default class LootOrb extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'loot_orb');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(15);
    this.body.setAllowGravity(false);
    this.type = 'gold';
    this.value = 1;
    this.meta = null;
    this.expiresAt = 0;
    this.setScale(0.95);
  }

  initDrop({ type = 'gold', value = 5, rarity = 'common', meta = null, now = performance.now() }) {
    this.type = type;
    this.value = value;
    this.meta = meta;
    this.expiresAt = now + 18000;
    this.setTint(RARITY_COLORS[rarity] || 0xffffff);
  }

  update(now, player) {
    if (now >= this.expiresAt) {
      this.destroy();
      return;
    }
    const d = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
    if (d < 140) {
      const t = Phaser.Math.Clamp((140 - d) / 140, 0, 1);
      const ang = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
      this.body.velocity.x = Math.cos(ang) * (80 + 320 * t);
      this.body.velocity.y = Math.sin(ang) * (80 + 320 * t);
    }
  }
}
