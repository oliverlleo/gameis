import RNG from '../core/RNG.js';
import { BIOME_CONFIG } from '../config/biomeConfig.js';
import SpawnSystem from '../systems/SpawnSystem.js';

export default class ProceduralChunkSystem {
    constructor(scene) {
        this.scene = scene;
        // Configurable seed, could come from save data
        this.seed = scene.loadData && scene.loadData.seed ? scene.loadData.seed : Math.floor(Math.random() * 99999);
        this.rng = new RNG(this.seed);
        this.chunkSize = 2048;
        this.activeChunks = [];
        this.chunkIndex = 0;
        this.spawnSystem = scene.spawnSystem; // Should be passed or retrieved

        // Initial setup
        this.createChunk(0);
        this.createChunk(1);
    }

    update(playerX) {
        const currentChunk = Math.floor(playerX / this.chunkSize);

        // Load ahead
        if (currentChunk + 2 > this.chunkIndex) {
            this.chunkIndex++;
            this.createChunk(this.chunkIndex);
        }

        // Unload behind
        // Keep 2 behind, 2 ahead
        // If index > current + 2, prune
        // If index < current - 2, prune

        // Using activeChunks queue
        if (this.activeChunks.length > 5) {
            const oldChunk = this.activeChunks.shift();
            this.destroyChunk(oldChunk);
        }
    }

    createChunk(index) {
        const xStart = index * this.chunkSize;
        const biomeId = this.getBiomeForChunk(index);
        const biome = Object.values(BIOME_CONFIG).find(b => b.id === biomeId);

        const chunkData = {
            index: index,
            platforms: [],
            enemies: [], // Should track spawned enemies to destroy them
            decorations: []
        };

        // Ground/Platform Generation
        let cx = xStart;
        const platforms = [];

        while (cx < xStart + this.chunkSize) {
            const width = this.rng.randRange(200, 600);
            if (cx + width > xStart + this.chunkSize) break;

            // Gap logic
            let isGap = false;
            // No gap in first chunk
            if (index > 0 && this.rng.random() < 0.2) {
                isGap = true;
                const gapSize = this.rng.randRange(100, 200); // 200 is jumpable
                cx += gapSize;
            }

            if (!isGap) {
                // Create floor
                const floor = this.scene.groundGroup.create(cx, this.scene.game.config.height - 32, 'tile_ground')
                    .setOrigin(0, 0)
                    .setDisplaySize(width, 32)
                    .refreshBody();
                floor.setTint(biome.tileColor);
                platforms.push(floor);
                chunkData.platforms.push(floor);

                // Add higher platforms
                if (this.rng.random() < 0.5) {
                    const px = cx + this.rng.randRange(50, width - 100);
                    const py = this.scene.game.config.height - 32 - this.rng.randRange(100, 250);
                    const pWidth = this.rng.randRange(100, 300);
                    const plat = this.scene.groundGroup.create(px, py, 'tile_platform')
                        .setOrigin(0, 0)
                        .setDisplaySize(pWidth, 20)
                        .refreshBody();
                    plat.setTint(biome.platformColor);

                    // One-way collision
                    plat.body.checkCollision.down = false;
                    plat.body.checkCollision.left = false;
                    plat.body.checkCollision.right = false;

                    platforms.push(plat);
                    chunkData.platforms.push(plat);
                }
                cx += width;
            }
        }

        // Spawn Enemies via SpawnSystem
        if (this.spawnSystem) {
             this.spawnSystem.spawnInChunk(xStart, this.chunkSize, platforms, biomeId, 1 + (index * 0.1));
        }

        this.activeChunks.push(chunkData);

        // Update background color based on biome
        // Smooth transition? Just set for now.
        // this.scene.cameras.main.setBackgroundColor(biome.backgroundColor);
    }

    destroyChunk(chunk) {
        chunk.platforms.forEach(p => p.destroy());

        // Cleanup enemies spawned in this chunk
        // We need to iterate global group and check bounds or tag
        // Simple distance check: if enemy is far behind player, kill it.
        const playerX = this.scene.player.sprite.x;
        this.scene.enemiesGroup.children.each(enemySprite => {
            if (enemySprite.x < playerX - 3000) { // 1.5 chunks behind
                if (enemySprite.entity && enemySprite.entity.die) {
                    enemySprite.entity.die(); // Graceful death (without rewards?)
                } else {
                    enemySprite.destroy();
                }
            }
        });
    }

    getBiomeForChunk(index) {
        const biomes = ['ruins', 'forest', 'forge', 'ethereal'];
        const biomeIndex = Math.floor(index / 5) % biomes.length;
        return biomes[biomeIndex];
    }
}
