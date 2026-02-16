import RNG from '../core/RNG.js';
import { BIOME_CONFIG } from '../config/biomeConfig.js';

export default class ProceduralChunkSystem {
    constructor(scene) {
        this.scene = scene;
        this.seed = scene.loadData && scene.loadData.seed ? scene.loadData.seed : Math.floor(Math.random() * 99999);
        this.rng = new RNG(this.seed);
        this.chunkSize = 2048;
        this.activeChunks = [];
        this.chunkIndex = 0;
        this.spawnSystem = scene.spawnSystem;

        // Initial setup
        this.createChunk(0);
        this.createChunk(1);
    }

    update(playerX) {
        const currentChunk = Math.floor(playerX / this.chunkSize);

        if (currentChunk + 2 > this.chunkIndex) {
            this.chunkIndex++;
            this.createChunk(this.chunkIndex);
        }

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
            enemies: []
        };

        // Floor Generation
        // Force create floor segments to guarantee walkable area
        let cx = xStart;
        const platforms = [];

        while (cx < xStart + this.chunkSize) {
            let width = this.rng.randRange(400, 800); // Wide platforms
            if (cx + width > xStart + this.chunkSize) width = (xStart + this.chunkSize) - cx;

            // Create Floor TileSprite for better visuals if texture tiles
            // Using existing logic:
            const floor = this.scene.groundGroup.create(cx, this.scene.game.config.height - 32, 'tile_ground')
                .setOrigin(0, 0)
                .setDisplaySize(width, 32)
                .refreshBody(); // Critical for collisions

            floor.setTint(biome.tileColor);
            platforms.push(floor);
            chunkData.platforms.push(floor);

            // Platform Logic
            if (this.rng.random() < 0.6) {
                const px = cx + this.rng.randRange(50, width - 150);
                const py = this.scene.game.config.height - 150;
                const pw = this.rng.randRange(100, 300);

                const plat = this.scene.groundGroup.create(px, py, 'tile_platform')
                    .setOrigin(0, 0)
                    .setDisplaySize(pw, 20)
                    .refreshBody();

                plat.body.checkCollision.down = false;
                plat.body.checkCollision.left = false;
                plat.body.checkCollision.right = false;

                platforms.push(plat);
                chunkData.platforms.push(plat);
            }

            cx += width;
            // Removed gaps completely for now to guarantee traversability
            // if (cx < xStart + this.chunkSize && this.rng.random() < 0.2) {
            //    cx += 100;
            // }
        }

        // Spawn Enemies
        if (this.spawnSystem) {
             this.spawnSystem.spawnInChunk(xStart, this.chunkSize, platforms, biomeId, 1 + (index * 0.1));
        }

        this.activeChunks.push(chunkData);
        this.scene.cameras.main.setBackgroundColor(biome.backgroundColor);
    }

    destroyChunk(chunk) {
        chunk.platforms.forEach(p => p.destroy());
        // Cleanup enemies logic (by distance) handled in GameScene or here?
        // Let's rely on GameScene update loop to kill far enemies
    }

    getBiomeForChunk(index) {
        const biomes = ['ruins', 'forest', 'forge', 'ethereal'];
        const biomeIndex = Math.floor(index / 5) % biomes.length;
        return biomes[biomeIndex];
    }
}
