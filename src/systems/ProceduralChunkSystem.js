import { gameConfig } from '../config/gameConfig.js';
import { biomeConfig } from '../config/biomeConfig.js';
import { physicsConfig } from '../config/physicsConfig.js';
import { RNG } from '../core/RNG.js';
import { EVENTS } from '../core/Constants.js';
import { EventBus } from '../core/EventBus.js';

export default class ProceduralChunkSystem {
  constructor(scene, runSeed) {
    this.scene = scene;
    this.seed = runSeed;
    this.chunkWidth = gameConfig.chunk.width;
    this.loaded = new Map();
    this.platformGapCap = this.computeGapCap();
    this.generatedCount = 0;
  }

  computeGapCap() {
    const jumpTime = Math.abs((2 * physicsConfig.jump.velocity) / physicsConfig.gravity);
    const maxDist = physicsConfig.maxHorizontalSpeed * jumpTime;
    return Math.floor(maxDist * 0.7);
  }

  getBiomeForChunk(chunkIndex) {
    const bands = biomeConfig.biomeBands;
    for (const b of bands) {
      if (chunkIndex >= b.fromChunk && chunkIndex <= b.toChunk) return b.biome;
    }
    return biomeConfig.order[biomeConfig.order.length - 1];
  }

  update(playerX) {
    const chunkIndex = Math.floor(playerX / this.chunkWidth);
    const min = chunkIndex - gameConfig.chunk.keepBehind;
    const max = chunkIndex + gameConfig.chunk.keepAhead;

    for (let i = min; i <= max; i++) {
      if (!this.loaded.has(i)) this.generateChunk(i);
    }
    for (const idx of [...this.loaded.keys()]) {
      if (idx < min || idx > max) this.unloadChunk(idx);
    }
  }

  generateChunk(index) {
    const x0 = index * this.chunkWidth;
    const biome = this.getBiomeForChunk(index);
    const bdef = biomeConfig.definitions[biome];
    const rng = new RNG(RNG.hashInts(this.seed, index, 8849));
    const chunk = {
      index,
      x: x0,
      width: this.chunkWidth,
      biome,
      spawnAnchors: [],
      platforms: [],
      hazards: []
    };

    this.createParallaxBand(chunk, bdef);

    // Ground / gaps
    let x = x0;
    const groundY = this.scene.config.world.groundY;
    while (x < x0 + this.chunkWidth) {
      const segW = rng.int(220, 460);
      const gap = rng.int(38, this.platformGapCap);
      const platform = this.createTerrainSegment(x, groundY, segW, 34, bdef.groundTop, bdef.groundBody);
      chunk.platforms.push(platform);
      chunk.spawnAnchors.push({ x: x + segW * 0.5, y: groundY });
      x += segW + gap;

      if (rng.chance(0.38)) {
        const pw = rng.int(120, 240);
        const py = groundY - rng.int(90, 165);
        const px = x - gap * 0.35;
        const p = this.createTerrainSegment(px, py, pw, 20, bdef.platform, bdef.platform);
        chunk.platforms.push(p);
        if (rng.chance(0.45)) chunk.spawnAnchors.push({ x: px + pw * 0.5, y: py - 10 });
      }

      if (rng.chance(bdef.hazardChance * 0.42)) {
        const hzX = x - gap * 0.5;
        const hz = this.scene.add.rectangle(hzX, groundY + 15, Math.min(58, gap - 12), 10, 0xff5555, 0.7).setDepth(11);
        this.scene.physics.add.existing(hz, true);
        hz.isHazard = true;
        this.scene.state.groups.hazards.add(hz);
        chunk.hazards.push(hz);
      }
    }

    this.loaded.set(index, chunk);
    this.generatedCount += 1;
    EventBus.emit(EVENTS.CHUNK_READY, chunk);
  }

  createTerrainSegment(centerX, centerY, width, height, topColor, bodyColor) {
    const g = this.scene.add.graphics();
    g.fillStyle(bodyColor, 1);
    g.fillRect(0, 0, width, height);
    g.fillStyle(topColor, 1);
    g.fillRect(0, 0, width, 6);

    const key = `terrain_${Math.round(width)}_${Math.round(height)}_${topColor}_${bodyColor}`;
    if (!this.scene.textures.exists(key)) {
      g.generateTexture(key, width, height);
    }
    g.destroy();

    const spr = this.scene.physics.add.staticSprite(centerX + width / 2, centerY + height / 2, key);
    spr.displayWidth = width;
    spr.displayHeight = height;
    spr.refreshBody();
    spr.setDepth(12);

    this.scene.state.groups.terrain.add(spr);
    return spr;
  }

  createParallaxBand(chunk, bdef) {
    const x0 = chunk.x;
    const w = chunk.width;
    for (let i = 0; i < bdef.parallax.length; i++) {
      const col = bdef.parallax[i];
      const h = 120 + i * 90;
      const y = this.scene.scale.height - (250 + i * 80);
      const rect = this.scene.add.rectangle(x0 + w / 2, y, w + 10, h, col, 0.78 - i * 0.12).setDepth(2 + i);
      rect.baseX = x0 + w / 2;
      rect.parallaxRatio = 0.12 + i * 0.06;
      this.scene.state.parallax.push(rect);
      chunk[`parallax_${i}`] = rect;
    }
  }

  unloadChunk(index) {
    const chunk = this.loaded.get(index);
    if (!chunk) return;

    const kill = (obj) => {
      if (!obj) return;
      if (obj.destroy) obj.destroy();
    };

    for (const p of chunk.platforms) kill(p);
    for (const hz of chunk.hazards || []) kill(hz);
    for (let i = 0; i < 5; i++) {
      kill(chunk[`parallax_${i}`]);
    }

    // remove spawned markers/entities belonging to chunk
    const xMin = chunk.x - 2;
    const xMax = chunk.x + chunk.width + 2;
    const groups = this.scene.state.groups;
    const maybeCull = (obj) => obj.x >= xMin && obj.x <= xMax;
    [groups.events, groups.loot].forEach((grp) => {
      grp.getChildren().forEach((e) => {
        if (e.active && maybeCull(e)) e.destroy();
      });
    });

    this.loaded.delete(index);
    EventBus.emit(EVENTS.CHUNK_UNLOADED, index);
  }

  getLoadedChunkCount() {
    return this.loaded.size;
  }
}
