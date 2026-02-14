import { progressionConfig } from '../config/progressionConfig.js';
export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player'); scene.add.existing(this); scene.physics.add.existing(this);
    this.body.setCollideWorldBounds(true);
    this.stats = { ...progressionConfig.baseStats };
    this.hp = this.stats.hp; this.energy = this.stats.energy; this.comboStep=0; this.comboTimer=0;
    this.cooldowns = {}; this.lastGroundedAt = 0; this.lastJumpPressAt = -9999; this.invulnUntil = 0;
    this.facing = 1;
  }
  gainEnergy(v){ this.energy = Math.min(this.stats.energy, this.energy + v); }
  takeDamage(v){ if (performance.now() < this.invulnUntil) return; this.hp -= Math.max(1, v - this.stats.defense*0.2); this.invulnUntil = performance.now() + 350; }
}
