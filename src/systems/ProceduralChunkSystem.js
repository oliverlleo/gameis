import { spawnConfig } from '../config/spawnConfig.js';
import { RNG } from '../core/RNG.js';
import { biomeConfig } from '../config/biomeConfig.js';

export class ProceduralChunkSystem {
  constructor(scene) { this.scene = scene; this.loaded = new Map(); this.seed = Number(localStorage.getItem('runSeed') || 93421); this.rng = new RNG(this.seed); }
  init() { this.ensureAround(0); }
  update() { this.ensureAround(Math.floor(this.scene.player.sprite.x / spawnConfig.chunkWidth)); this.unloadFar(); }
  ensureAround(center) {
    for (let i = center - spawnConfig.keepBehind; i <= center + spawnConfig.keepAhead; i++) if (!this.loaded.has(i)) this.buildChunk(i);
  }
  buildChunk(index) {
    const x0 = index * spawnConfig.chunkWidth;
    const biome = biomeConfig[Math.abs(index) % biomeConfig.length];
    const g = this.scene.add.rectangle(x0 + spawnConfig.chunkWidth/2, 700, spawnConfig.chunkWidth, 40, Phaser.Display.Color.HexStringToColor(biome.palette[0]).color).setOrigin(0.5);
    this.scene.physics.add.existing(g, true); this.scene.platforms.add(g);
    for (let i = 0; i < 5; i++) {
      const px = x0 + 220 + i * 360 + this.rng.int(-70, 70);
      const py = 520 - (i%3)*80;
      const p = this.scene.add.rectangle(px, py, 130, 18, Phaser.Display.Color.HexStringToColor(biome.palette[1]).color);
      this.scene.physics.add.existing(p, true); this.scene.platforms.add(p);
    }
    this.loaded.set(index, { biome: biome.name });
  }
  unloadFar() {
    const c = Math.floor(this.scene.player.sprite.x / spawnConfig.chunkWidth);
    for (const k of [...this.loaded.keys()]) if (k < c - spawnConfig.keepBehind - 1 || k > c + spawnConfig.keepAhead + 1) this.loaded.delete(k);
  }
}
