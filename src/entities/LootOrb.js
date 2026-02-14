export class LootOrb extends Phaser.Physics.Arcade.Image {
  constructor(scene,x,y){ super(scene,x,y,'loot'); scene.add.existing(this); scene.physics.add.existing(this); this.setBounce(0.2); }
}
