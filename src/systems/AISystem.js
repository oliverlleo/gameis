export default class AISystem {
    constructor(scene) {
        this.scene = scene;
        this.maxAttackers = 3;
        this.attackTokens = 0;
    }

    update(time, delta) {
        // Simple token system
        // Reset tokens every frame? No, tokens should be held for duration of attack.
        // But since I don't have complex messaging, I'll just check state.

        const enemies = this.scene.getEnemies(); // Assuming GameScene exposes this
        if (!enemies) return;

        let attacking = 0;
        enemies.forEach(e => {
            if (e.state === 'ATTACK') attacking++;
        });

        enemies.forEach(e => {
            if (e.state === 'CHASE' && attacking < this.maxAttackers) {
                // Allowed to attack
                e.canAttack = true;
            } else if (e.state === 'CHASE') {
                e.canAttack = false; // Must wait
                // Maybe switch to 'CIRCLE' state?
                // For now, just prevent transition to ATTACK in EnemyBase if I implemented check there.
            }
        });
    }
}
