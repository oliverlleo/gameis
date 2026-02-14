export class Projectile extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) { super(scene, x, y, 'loot'); scene.add.existing(this); scene.physics.add.existing(this); this.active=false; }
  fire(x,y,vx,vy,dmg,owner='player'){ this.enableBody(true,x,y,true,true); this.setVelocity(vx,vy); this.damage=dmg; this.owner=owner; }
}
