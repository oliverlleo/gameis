export class EnemyBase extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type = 'melee') {
    super(scene, x, y, 'enemy');
    scene.add.existing(this); scene.physics.add.existing(this);
    this.type = type; this.hp = 70; this.maxHp = 70; this.state = 'patrol'; this.speed = 70;
    this.lastAttackAt = 0; this.isEnemy = true; this.mass = 1;
  }
  takeDamage(amount) {
    this.hp -= amount;
    this.setTintFill(0xffffff);
    this.scene.time.delayedCall(60, () => this.clearTint());
    if (this.hp <= 0) { this.disableBody(true, true); this.scene.systemsMap.loot.spawnLoot(this.x, this.y); this.scene.systemsMap.progression.addXP(12); }
  }
}
