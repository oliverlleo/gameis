export default class SlashEffect {
    constructor(scene, x, y, flipX) {
        this.scene = scene;
        this.graphics = scene.add.graphics();
        this.x = x;
        this.y = y;
        this.flipX = flipX;
        this.life = 0;

        this.draw();

        // Auto destroy
        scene.tweens.add({
            targets: this,
            life: 1,
            duration: 200,
            onUpdate: () => this.draw(),
            onComplete: () => this.destroy()
        });
    }

    draw() {
        this.graphics.clear();
        this.graphics.lineStyle(4, 0xffffff, 1 - this.life);
        this.graphics.fillStyle(0xccffff, 0.5 * (1 - this.life));

        const startAngle = this.flipX ? 135 : 45;
        const endAngle = this.flipX ? 225 : -45;

        this.graphics.beginPath();
        this.graphics.arc(this.x, this.y, 40 + (this.life * 20), Phaser.Math.DegToRad(startAngle), Phaser.Math.DegToRad(endAngle), this.flipX);
        this.graphics.strokePath();

        // Inner fill
        this.graphics.beginPath();
        this.graphics.arc(this.x, this.y, 30 + (this.life * 10), Phaser.Math.DegToRad(startAngle), Phaser.Math.DegToRad(endAngle), this.flipX);
        this.graphics.fillPath();
    }

    destroy() {
        this.graphics.destroy();
    }
}
