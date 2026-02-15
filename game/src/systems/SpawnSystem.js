import { BIOME_CONFIG } from '../config/biomeConfig.js';
import EnemyMelee from '../entities/EnemyMelee.js';
import EnemyRanged from '../entities/EnemyRanged.js';
import EnemyTank from '../entities/EnemyTank.js';
import EnemySupport from '../entities/EnemySupport.js';
import EnemyAssassin from '../entities/EnemyAssassin.js';
import EnemyExploder from '../entities/EnemyExploder.js';
import EnemyShield from '../entities/EnemyShield.js';
import EnemyGhost from '../entities/EnemyGhost.js';
import EnemyBat from '../entities/EnemyBat.js';
import EnemySlime from '../entities/EnemySlime.js';
import BossA from '../entities/BossA.js';
import BossB from '../entities/BossB.js';

export default class SpawnSystem {
    constructor(scene) {
        this.scene = scene;
        this.spawnMap = {
            'enemy_melee': EnemyMelee,
            'enemy_ranged': EnemyRanged,
            'enemy_tank': EnemyTank,
            'enemy_support': EnemySupport,
            'enemy_assassin': EnemyAssassin,
            'enemy_exploder': EnemyExploder,
            'enemy_shield': EnemyShield,
            'enemy_ghost': EnemyGhost,
            'enemy_bat': EnemyBat,
            'enemy_slime': EnemySlime
        };
    }

    spawnInChunk(chunkX, chunkWidth, platforms, biomeId, difficulty) {
        const biome = Object.values(BIOME_CONFIG).find(b => b.id === biomeId);
        if (!biome) return;

        // Density based on difficulty
        const density = 0.002 * (1 + difficulty * 0.2);

        platforms.forEach(platform => {
            if (platform.width > 100 && Math.random() < density * platform.width) {
                // Determine Enemy Type
                const enemyType = Phaser.Math.RND.pick(biome.enemies);
                const EnemyClass = this.spawnMap[enemyType];

                if (EnemyClass) {
                    const x = platform.x + Math.random() * (platform.width - 50);
                    const y = platform.y - 50;

                    // Avoid spawning directly on player spawn (first chunk)
                    if (chunkX === 0 && x < 400) return;

                    const enemy = new EnemyClass(this.scene, x, y);

                    // Add to group
                    this.scene.enemiesGroup.add(enemy.sprite);

                    // Elite chance
                    if (Math.random() < 0.05 * difficulty) {
                        this.makeElite(enemy);
                    }
                }
            }
        });
    }

    makeElite(enemy) {
        enemy.sprite.setScale(enemy.sprite.scaleX * 1.2);
        enemy.stats.hp *= 2;
        enemy.stats.damage *= 1.5;
        enemy.stats.xpReward *= 3;
        enemy.sprite.setTint(0xffd700); // Gold
        enemy.isElite = true;
    }

    spawnBoss(x, y, level) {
        const BossClass = (level % 2 !== 0) ? BossA : BossB;
        const boss = new BossClass(this.scene, x, y);
        this.scene.enemiesGroup.add(boss.sprite);
        return boss;
    }
}
