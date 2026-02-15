export default class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'projectile_basic');
    }

    fire(targetX, targetY, speed) {
        this.setActive(true).setVisible(true);
        this.body.enable = true;
        
        this.scene.physics.moveTo(this, targetX, targetY, speed);
        this.rotation = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
        
        // Auto recycle
        this.scene.time.delayedCall(2000, () => {
            if (this.active) {
                this.setActive(false).setVisible(false);
                this.body.enable = false;
            }
        });
    }

    update(time, delta) {
        if (!this.active) return;
    }
}
