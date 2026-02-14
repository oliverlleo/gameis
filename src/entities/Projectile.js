export default class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'projectile_basic');
    }

    fire(targetX, targetY, speed) {
        this.scene.physics.moveTo(this, targetX, targetY, speed);
        this.rotation = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
        // Auto destroy
        this.scene.time.delayedCall(2000, () => {
            if (this.active) this.destroy();
        });
    }

    update(time, delta) {
        // Custom logic if needed
    }
}
