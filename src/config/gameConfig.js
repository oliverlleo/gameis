import { physicsConfig } from './physicsConfig.js';
import { spawnConfig } from './spawnConfig.js';

export const gameConfig = {
  width: 1280,
  height: 720,
  game: { width: 1280, height: 720 },
  backgroundColor: '#0b0f19',
  targetFps: 60,
  physics: {
    gravity: physicsConfig.gravity
  },
  world: {
    startX: 160,
    startY: 420,
    gravityY: 2200,
    groundY: 560,
    worldFallY: 1200,
    safeRespawnXOffset: 120,
    entityCleanupDistance: 1400,
    backgroundColor: '#111827'
  },
  chunk: {
    width: 2048,
    keepBehind: 2,
    keepAhead: 4
  },
  spawn: spawnConfig,
  camera: {
    lerpX: 0.08,
    lerpY: 0.1,
    deadzoneW: 300,
    deadzoneH: 220,
    zoom: 1
  },
  defaultSeed: 73496211,
  saveKey: 'neon_frontier_save_v2',
  ui: {
    toastSeconds: 1.8,
    tutorialTimeoutMs: 4200
  }
};
