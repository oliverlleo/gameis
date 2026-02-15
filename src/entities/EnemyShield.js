import EnemyBase from './EnemyBase.js';

export default class EnemyShield extends EnemyBase {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy_melee');
        this.sprite.setTint(0x8888aa); // Metallic blue
        this.stats = { hp: 150, damage: 15, xpReward: 35 };
        this.moveSpeed = 80;
    }

    takeDamage(amount, source) {
        if (source && source.sprite) {
            // Check direction
            const isFront = (source.sprite.x > this.sprite.x && !this.sprite.flipX) || 
                            (source.sprite.x < this.sprite.x && this.sprite.flipX);
            
            if (isFront) {
                // Block
                amount = 0;
                this.sprite.setTint(0x0000ff); // Flash blue
                this.scene.time.delayedCall(100, () => this.sprite.clearTint());
                // Maybe play block sound
                return; 
            }
        }
        super.takeDamage(amount, source);
    }
}
