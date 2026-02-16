import { gameConfig } from '../config/gameConfig.js';
import { RNG } from './RNG.js';
import Player from '../entities/Player.js';

import InputSystem from '../systems/InputSystem.js';
import MovementSystem from '../systems/MovementSystem.js';
import CollisionSystem from '../systems/CollisionSystem.js';
import CombatSystem from '../systems/CombatSystem.js';
import SkillSystem from '../systems/SkillSystem.js';
import StatusSystem from '../systems/StatusSystem.js';
import AISystem from '../systems/AISystem.js';
import DirectorSystem from '../systems/DirectorSystem.js';
import SpawnSystem from '../systems/SpawnSystem.js';
import ProceduralChunkSystem from '../systems/ProceduralChunkSystem.js';
import LootSystem from '../systems/LootSystem.js';
import ProgressionSystem from '../systems/ProgressionSystem.js';
import EconomySystem from '../systems/EconomySystem.js';
import TalentSystem from '../systems/TalentSystem.js';
import UISystem from '../systems/UISystem.js';
import AudioSystem from '../systems/AudioSystem.js';
import SaveSystem from '../systems/SaveSystem.js';
import VFXSystem from '../systems/VFXSystem.js';
import CameraSystem from '../systems/CameraSystem.js';
import PerformanceSystem from '../systems/PerformanceSystem.js';
import ValidationSystem from '../systems/ValidationSystem.js';

import DebugOverlay from '../debug/DebugOverlay.js';
import { registerDebugCommands } from '../debug/DebugCommands.js';
import { testSeeds } from '../debug/TestScenarios.js';

function ensureTexture(scene, key, drawFn, w, h) {
  if (scene.textures.exists(key)) return;
  const g = scene.add.graphics();
  drawFn(g);
  g.generateTexture(key, w, h);
  g.destroy();
}

function buildPrimitiveAtlas(scene) {
  ensureTexture(scene, 'player', (g) => {
    g.fillStyle(0x6ed6ff, 1); g.fillRect(0, 0, 24, 34);
    g.fillStyle(0xc6f5ff, 1); g.fillRect(6, 6, 12, 8);
    g.fillStyle(0x0f2236, 1); g.fillRect(8, 8, 2, 2); g.fillRect(14, 8, 2, 2);
    g.fillStyle(0x4ea2cf, 1); g.fillRect(4, 20, 16, 10);
  }, 24, 34);

  ensureTexture(scene, 'enemy_melee', (g) => { g.fillStyle(0xd96b6b,1); g.fillRect(0,0,24,28); g.fillStyle(0x351010,1); g.fillRect(6,6,2,2); g.fillRect(16,6,2,2); }, 24, 28);
  ensureTexture(scene, 'enemy_ranged', (g) => { g.fillStyle(0xd1a46c,1); g.fillRect(0,0,24,28); g.fillStyle(0x46341f,1); g.fillRect(6,6,2,2); g.fillRect(16,6,2,2); }, 24, 28);
  ensureTexture(scene, 'enemy_tank', (g) => { g.fillStyle(0xa06cd1,1); g.fillRect(0,0,28,34); g.fillStyle(0x291f3a,1); g.fillRect(8,8,3,3); g.fillRect(17,8,3,3); }, 28, 34);
  ensureTexture(scene, 'enemy_support', (g) => { g.fillStyle(0x5ccba0,1); g.fillRect(0,0,22,26); g.fillStyle(0x1e3f35,1); g.fillRect(6,6,2,2); g.fillRect(14,6,2,2); }, 22, 26);
  ensureTexture(scene, 'enemy_summoner', (g) => { g.fillStyle(0x8f7ad8,1); g.fillRect(0,0,24,30); g.fillStyle(0x2d2148,1); g.fillRect(6,7,2,2); g.fillRect(16,7,2,2); }, 24, 30);
  ensureTexture(scene, 'enemy_assassin', (g) => { g.fillStyle(0x7090d8,1); g.fillRect(0,0,21,25); g.fillStyle(0x1c2748,1); g.fillRect(6,6,2,2); g.fillRect(13,6,2,2); }, 21, 25);

  ensureTexture(scene, 'boss_a', (g) => { g.fillStyle(0xc07848,1); g.fillRect(0,0,64,78); g.fillStyle(0x2e1708,1); g.fillRect(20,18,5,5); g.fillRect(40,18,5,5); }, 64, 78);
  ensureTexture(scene, 'boss_b', (g) => { g.fillStyle(0x5f7cd1,1); g.fillRect(0,0,62,76); g.fillStyle(0x162040,1); g.fillRect(19,18,5,5); g.fillRect(39,18,5,5); }, 62, 76);

  ensureTexture(scene, 'proj_enemy', (g) => { g.fillStyle(0xff996d,1); g.fillCircle(6, 6, 6); }, 12, 12);
  ensureTexture(scene, 'proj_player', (g) => { g.fillStyle(0x9eddff,1); g.fillCircle(6, 6, 6); }, 12, 12);

  ensureTexture(scene, 'loot_common', (g) => { g.fillStyle(0xbfcad8,1); g.fillCircle(8,8,7); }, 16, 16);
  ensureTexture(scene, 'loot_uncommon', (g) => { g.fillStyle(0x77d18c,1); g.fillCircle(8,8,7); }, 16, 16);
  ensureTexture(scene, 'loot_rare', (g) => { g.fillStyle(0x67b5ff,1); g.fillCircle(8,8,7); }, 16, 16);
  ensureTexture(scene, 'loot_epic', (g) => { g.fillStyle(0xbd73ff,1); g.fillCircle(8,8,7); }, 16, 16);
  ensureTexture(scene, 'loot_legendary', (g) => { g.fillStyle(0xffb347,1); g.fillCircle(8,8,7); }, 16, 16);
}

class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
    this.config = gameConfig;
  }

  init(data) {
    this.runSeed = data?.seed ?? Math.floor(Math.random() * 1_000_000_000);
  }

  preload() {}

  create(data) {
    buildPrimitiveAtlas(this);

    this.state = {
      player: null,
      groups: {
        terrain: this.physics.add.staticGroup(),
        enemies: this.physics.add.group({ runChildUpdate: true }),
        playerProjectiles: this.physics.add.group({ runChildUpdate: true }),
        enemyProjectiles: this.physics.add.group({ runChildUpdate: true }),
        loot: this.physics.add.group({ runChildUpdate: true }),
        hazards: this.physics.add.staticGroup(),
        events: this.physics.add.group({ runChildUpdate: false })
      },
      parallax: [],
      metrics: {}
    };

    this.state.player = new Player(this, this.config.world.startX, this.config.world.startY);
    this.state.player.setDepth(40);

    this.systemsRef = {
      input: new InputSystem(this),
      movement: new MovementSystem(this),
      collision: new CollisionSystem(this),
      combat: new CombatSystem(this),
      skill: new SkillSystem(this),
      status: new StatusSystem(this),
      ai: new AISystem(this),
      director: new DirectorSystem(this),
      spawn: new SpawnSystem(this),
      chunk: new ProceduralChunkSystem(this, this.runSeed),
      loot: new LootSystem(this),
      progression: new ProgressionSystem(this),
      economy: new EconomySystem(this),
      talent: new TalentSystem(this),
      ui: new UISystem(this),
      audio: new AudioSystem(this),
      save: new SaveSystem(this),
      vfx: new VFXSystem(this),
      camera: new CameraSystem(this),
      performance: new PerformanceSystem(this),
      validation: new ValidationSystem(this)
    };

    this.systemsRef.debugOverlay = new DebugOverlay(this);

    const now = performance.now();

    this.systemsRef.input.init();
    this.systemsRef.talent.init();
    this.systemsRef.performance.init();
    this.systemsRef.director.init(now);
    this.systemsRef.spawn.init();
    this.systemsRef.loot.init();
    this.systemsRef.ui.init();
    this.systemsRef.audio.init();
    this.systemsRef.camera.init();
    this.systemsRef.progression.init();
    this.systemsRef.validation.init(now);
    this.systemsRef.validation.runImmediateChecks();

    this.systemsRef.collision.bind();
    this.systemsRef.debugOverlay.init();
    registerDebugCommands(this);

    // load save
    const snap = this.systemsRef.save.load();
    if (snap && this.systemsRef.save.applySnapshot(snap)) {
      this.systemsRef.ui.toast('Save loaded');
    }

    // initial chunks around start
    this.systemsRef.chunk.update(this.state.player.x);

    // hazard overlap
    this.physics.add.overlap(this.state.player, this.state.groups.hazards, (p, hz) => {
      const nowMs = performance.now();
      p.receiveDamage(Math.round(p.maxHp * 0.06), nowMs, 0, -130);
      this.systemsRef.vfx.hitSpark(p.x, p.y, 0xff5e5e);
    });

    // tutorial prompts
    this.systemsRef.ui.tutorial('A/D move, SPACE jump, J combo, K heavy, QWERF skills');
    this.time.delayedCall(5000, () => this.systemsRef.ui.tutorial('Explore forward. Defeat enemies for XP and Gold.'));
  }

  update(time, delta) {
    const now = performance.now();
    const p = this.state.player;
    if (!p || !p.active) return;

    // if dead handle phoenix revive
    if (!p.isAlive()) {
      if (this.systemsRef.talent.revives > 0) {
        this.systemsRef.talent.revives -= 1;
        p.hp = Math.round(p.maxHp * 0.35);
        p.energy = Math.round(p.maxEnergy * 0.45);
        p.setIFrames(1400, now);
        this.systemsRef.vfx.levelUpBurst(p.x, p.y - 20);
        this.systemsRef.ui.toast('Phoenix Oath revived you');
      } else {
        this.systemsRef.save.save();
        this.systemsRef.ui.tutorial('You died. Press ESC > Restart Run.');
        p.body.setVelocity(0, 0);
        return;
      }
    }

    this.systemsRef.chunk.update(p.x);
    this.systemsRef.director.update(now, delta);
    this.systemsRef.spawn.update(now);

    this.systemsRef.movement.update(delta, now);
    this.systemsRef.ai.update(now, delta);
    this.systemsRef.combat.update(delta, now);
    this.systemsRef.skill.update(now);
    this.systemsRef.status.update(now, delta / 1000);
    this.systemsRef.loot.update(now);

    this.systemsRef.performance.update(now);
    this.systemsRef.progression.update(now);
    this.systemsRef.audio.update();
    this.systemsRef.vfx.update();
    this.systemsRef.camera.update();
    this.systemsRef.ui.update(now);

    this.systemsRef.validation.update(now);
    this.systemsRef.save.update(now);
    this.systemsRef.debugOverlay.update();

    // dynamic tutorial triggers
    if (!this.didFirstSkill && Object.values(p.cooldowns).some((cd) => cd > now)) {
      this.didFirstSkill = true;
      this.systemsRef.ui.tutorial('Great. Spend gold in Merchant events for upgrades.');
    }
    if (!this.didFirstCombo && p.comboStep >= 2) {
      this.didFirstCombo = true;
      this.systemsRef.ui.tutorial('Combo chain improves pressure. Heavy is risk/reward.');
    }
  }
}

export function createGame(containerId = 'game-container', seed = null) {
  const config = {
    type: Phaser.AUTO,
    parent: containerId,
    width: gameConfig.game.width,
    height: gameConfig.game.height,
    pixelArt: true,
    backgroundColor: '#141622',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: gameConfig.physics.gravity },
        debug: false
      }
    },
    scene: [MainScene],
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
    }
  };

  const game = new Phaser.Game(config);
  game.scene.start('MainScene', { seed: seed ?? Math.floor(Math.random() * 1_000_000_000) });
  return game;
}
