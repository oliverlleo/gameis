import { gameConfig } from '../config/gameConfig.js';
import { physicsConfig } from '../config/physicsConfig.js';
import { InputSystem } from '../systems/InputSystem.js';
import { MovementSystem } from '../systems/MovementSystem.js';
import { CollisionSystem } from '../systems/CollisionSystem.js';
import { CombatSystem } from '../systems/CombatSystem.js';
import { SkillSystem } from '../systems/SkillSystem.js';
import { StatusSystem } from '../systems/StatusSystem.js';
import { AISystem } from '../systems/AISystem.js';
import { DirectorSystem } from '../systems/DirectorSystem.js';
import { SpawnSystem } from '../systems/SpawnSystem.js';
import { ProceduralChunkSystem } from '../systems/ProceduralChunkSystem.js';
import { LootSystem } from '../systems/LootSystem.js';
import { ProgressionSystem } from '../systems/ProgressionSystem.js';
import { EconomySystem } from '../systems/EconomySystem.js';
import { TalentSystem } from '../systems/TalentSystem.js';
import { UISystem } from '../systems/UISystem.js';
import { AudioSystem } from '../systems/AudioSystem.js';
import { SaveSystem } from '../systems/SaveSystem.js';
import { VFXSystem } from '../systems/VFXSystem.js';
import { CameraSystem } from '../systems/CameraSystem.js';
import { PerformanceSystem } from '../systems/PerformanceSystem.js';
import { ValidationSystem } from '../systems/ValidationSystem.js';
import { Player } from '../entities/Player.js';
import { DebugOverlay } from '../debug/DebugOverlay.js';

export class MainScene extends Phaser.Scene {
  constructor() { super('main'); }
  preload() {
    const g = this.add.graphics();
    g.fillStyle(0xffffff).fillRect(0, 0, 24, 36);
    g.generateTexture('player', 24, 36);
    g.clear(); g.fillStyle(0xff4d4d).fillRect(0, 0, 20, 28); g.generateTexture('enemy', 20, 28);
    g.clear(); g.fillStyle(0xffd447).fillRect(0, 0, 10, 10); g.generateTexture('loot', 10, 10);
    g.clear(); g.fillStyle(0x7f8fa6).fillRect(0, 0, 128, 24); g.generateTexture('platform', 128, 24);
    g.destroy();
  }
  create() {
    this.physics.world.gravity.y = physicsConfig.gravity;
    this.platforms = this.physics.add.staticGroup();
    this.enemies = this.physics.add.group();
    this.projectiles = this.physics.add.group();
    this.loot = this.physics.add.group();

    this.player = new Player(this, 180, 420);
    this.systemsMap = {
      input: new InputSystem(this), movement: new MovementSystem(this), collision: new CollisionSystem(this),
      combat: new CombatSystem(this), skills: new SkillSystem(this), status: new StatusSystem(this), ai: new AISystem(this),
      director: new DirectorSystem(this), spawn: new SpawnSystem(this), chunks: new ProceduralChunkSystem(this),
      loot: new LootSystem(this), progression: new ProgressionSystem(this), economy: new EconomySystem(this),
      talents: new TalentSystem(this), ui: new UISystem(this), audio: new AudioSystem(this), save: new SaveSystem(this),
      vfx: new VFXSystem(this), camera: new CameraSystem(this), perf: new PerformanceSystem(this),
      validation: new ValidationSystem(this),
    };
    Object.values(this.systemsMap).forEach((s) => s.init?.());
    this.debugOverlay = new DebugOverlay(this);
    this.input.keyboard.on('keydown-F3', () => this.debugOverlay.visible = !this.debugOverlay.visible);
    this.distance = 0;
    this.lastX = this.player.x;
  }
  update(_, delta) {
    const dt = delta / 1000;
    this.distance += Math.max(0, this.player.x - this.lastX);
    this.lastX = this.player.x;
    Object.values(this.systemsMap).forEach((s) => s.update?.(dt));
    this.debugOverlay.update();
    if (this.player.y > gameConfig.worldHeight) this.systemsMap.validation.safeRespawn();
  }
}
