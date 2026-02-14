import { spawnConfig } from '../config/spawnConfig.js';
import { RNG } from '../core/RNG.js';
import { biomeConfig } from '../config/biomeConfig.js';

export class ProceduralChunkSystem {
  constructor(scene) {
    this.scene = scene;
    this.loaded = new Map();
    this.seed = Number(localStorage.getItem('runSeed') || 93421);
    this.rng = new RNG(this.seed);
  }

  init() {
    this.ensureAround(0);
  }

  update() {
    const center = Math.floor(this.scene.player.sprite.x / spawnConfig.chunkWidth);
    this.ensureAround(center);
    this.unloadFar(center);
  }

  ensureAround(center) {
    for (let i = center - spawnConfig.keepBehind; i <= center + spawnConfig.keepAhead; i++) {
      if (!this.loaded.has(i)) this.buildChunk(i);
    }
  }

  buildChunk(index) {
    const x0 = index * spawnConfig.chunkWidth;
    const biome = biomeConfig[Math.abs(index) % biomeConfig.length];

    const objs = [];

    const bg = this.scene.add.rectangle(x0 + spawnConfig.chunkWidth * 0.5, 310, spawnConfig.chunkWidth, 620, Phaser.Display.Color.HexStringToColor(biome.palette[0]).color, 0.55).setDepth(-10);
    objs.push(bg);

    const layer2 = this.scene.add.rectangle(x0 + spawnConfig.chunkWidth * 0.5, 420, spawnConfig.chunkWidth, 240, Phaser.Display.Color.HexStringToColor(biome.palette[1]).color, 0.35).setDepth(-8);
    objs.push(layer2);

    const ground = this.scene.add.rectangle(x0 + spawnConfig.chunkWidth / 2, 700, spawnConfig.chunkWidth, 40, Phaser.Display.Color.HexStringToColor(biome.palette[1]).color).setOrigin(0.5);
    this.scene.physics.add.existing(ground, true);
    this.scene.platforms.add(ground);
    objs.push(ground);

    for (let i = 0; i < 5; i++) {
      const px = x0 + 240 + i * 340 + this.rng.int(-60, 60);
      const py = 520 - (i % 3) * 78;
      const p = this.scene.add.rectangle(px, py, 130, 18, Phaser.Display.Color.HexStringToColor(biome.palette[2]).color);
      this.scene.physics.add.existing(p, true);
      this.scene.platforms.add(p);
      objs.push(p);
    }

    this.loaded.set(index, { biome: biome.name, objs });
  }

  unloadFar(center) {
    for (const [k, chunk] of this.loaded.entries()) {
      if (k < center - spawnConfig.keepBehind - 1 || k > center + spawnConfig.keepAhead + 1) {
        chunk.objs.forEach(o => o.destroy());
        this.loaded.delete(k);
      }
    }
  }
}
