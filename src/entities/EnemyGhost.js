import EnemyBase from './EnemyBase.js';

export default class EnemyGhost extends EnemyBase {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy_melee');
        this.sprite.setAlpha(0.6);
        this.sprite.body.setAllowGravity(false); // Fly
        this.stats = { hp: 40, damage: 15, xpReward: 25 };
        this.moveSpeed = 80;
    }

    handleMovement(delta) {
        // Fly towards player directly
        const dx = this.target.sprite.x - this.sprite.x;
        const dy = this.target.sprite.y - this.sprite.y;
        
        const angle = Math.atan2(dy, dx);
        this.sprite.setVelocityX(Math.cos(angle) * this.moveSpeed);
        this.sprite.setVelocityY(Math.sin(angle) * this.moveSpeed);
        
        this.sprite.setFlipX(dx < 0);
    }
}
