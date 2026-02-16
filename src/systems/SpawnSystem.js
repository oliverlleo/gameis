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

        // Force spawn at least some enemies per chunk
        // Density logic:
        const count = Math.floor(difficulty * 2) + 2; // Min 2 enemies
        
        for(let i=0; i<count; i++) {
            const platform = Phaser.Math.RND.pick(platforms);
            if (platform) {
                const enemyType = Phaser.Math.RND.pick(biome.enemies);
                const EnemyClass = this.spawnMap[enemyType];
                
                if (EnemyClass) {
                    const x = platform.x + Math.random() * (platform.width * 0.8);
                    const y = platform.y - 60;
                    
                    // Safety check: Don't spawn on player start
                    if (chunkX === 0 && x < 600) continue;

                    try {
                        const enemy = new EnemyClass(this.scene, x, y);
                        this.scene.enemiesGroup.add(enemy.sprite);
                        
                        console.log(`Spawned ${enemyType} at ${Math.floor(x)}, ${Math.floor(y)}`);
                        
                        // Elite
                        if (Math.random() < 0.1) this.makeElite(enemy);
                    } catch (e) {
                        console.error("Spawn Error:", e);
                    }
                }
            }
        }
    }
    
    makeElite(enemy) {
        enemy.sprite.setScale(1.2);
        enemy.stats.hp *= 2;
        enemy.stats.damage *= 1.5;
        enemy.sprite.setTint(0xffd700);
        enemy.isElite = true;
    }

    spawnBoss(type, x) {
        console.log(`Spawning Boss: ${type}`);
        const BossClass = (type === 'boss_a') ? BossA : BossB;
        const y = this.scene.game.config.height - 200;
        const boss = new BossClass(this.scene, x, y);
        this.scene.enemiesGroup.add(boss.sprite);
        return boss;
    }
}
