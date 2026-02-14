import EnemyBase from './EnemyBase.js';

export default class EnemyTank extends EnemyBase {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy_melee'); // Use melee texture for now
        this.sprite.setTint(0x555555); // Darker
        this.sprite.setScale(1.5);

        this.stats = {
            hp: 200,
            maxHp: 200,
            damage: 20,
            xpReward: 40
        };

        this.moveSpeed = 50;
    }

    takeDamage(amount) {
        // Reduced damage
        super.takeDamage(amount * 0.7);
    }
}
