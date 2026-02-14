import RNG from '../core/RNG.js';
import { BIOME_CONFIG } from '../config/biomeConfig.js';
import SpawnSystem from './SpawnSystem.js';

export default class ProceduralChunkSystem {
    constructor(scene) {
        this.scene = scene;
        this.rng = new RNG(12345); // Fixed seed for now, can be randomized
        this.chunkSize = 2048;
        this.activeChunks = [];
        this.lastChunkX = 0;
        this.spawnSystem = new SpawnSystem(scene);
        this.chunkIndex = 0;

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
        if (this.activeChunks.length > 4) {
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
            enemies: [],
            decorations: []
        };

        // Ground/Platform Generation
        // Start height based on previous or noise?
        // Simple: Base floor + random platforms

        // Base floor segments (gaps possible)
        let cx = xStart;
        while (cx < xStart + this.chunkSize) {
            const width = this.rng.randRange(200, 600);
            if (cx + width > xStart + this.chunkSize) break;

            // Gap chance
            if (this.rng.random() < 0.2 && index > 0) {
                cx += this.rng.randRange(100, 200); // Gap
            } else {
                // Create floor
                const floor = this.scene.groundGroup.create(cx, this.scene.game.config.height - 32, 'tile_ground')
                    .setOrigin(0, 0)
                    .setDisplaySize(width, 32)
                    .refreshBody();
                floor.setTint(biome.tileColor);
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
                    // One-way collision? Arcade physics 'checkCollision.down = false' etc.
                    plat.body.checkCollision.down = false;
                    plat.body.checkCollision.left = false;
                    plat.body.checkCollision.right = false;

                    chunkData.platforms.push(plat);
                }

                cx += width;
            }
        }

        // Spawn Enemies
        this.spawnSystem.spawnInChunk(xStart, this.chunkSize, chunkData.platforms, biomeId, 1 + (index * 0.1));

        this.activeChunks.push(chunkData);

        // Update background color based on biome
        this.scene.cameras.main.setBackgroundColor(biome.backgroundColor);
    }

    destroyChunk(chunk) {
        chunk.platforms.forEach(p => p.destroy());
        // Enemies are in global group, rely on cleanup by distance
    }

    getBiomeForChunk(index) {
        // Cycle biomes every 5 chunks
        const biomes = ['ruins', 'forest', 'forge', 'ethereal'];
        const biomeIndex = Math.floor(index / 5) % biomes.length;
        return biomes[biomeIndex];
    }
}
