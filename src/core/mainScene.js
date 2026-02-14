import { Player } from '../entities/Player.js';
import { ProceduralChunkSystem } from '../systems/ProceduralChunkSystem.js';
import { SpawnSystem } from '../systems/SpawnSystem.js';
import { CombatSystem } from '../systems/CombatSystem.js';
import { SkillSystem } from '../systems/SkillSystem.js';
import { UISystem } from '../systems/UISystem.js';
import { SaveSystem } from '../systems/SaveSystem.js';
import { ProgressionSystem } from '../systems/ProgressionSystem.js';
import { DirectorSystem } from '../systems/DirectorSystem.js';
import { CameraSystem } from '../systems/CameraSystem.js';
import { PerformanceSystem } from '../systems/PerformanceSystem.js';
import { DebugOverlay } from '../debug/DebugOverlay.js';
import { TalentSystem } from '../systems/TalentSystem.js';
import { ValidationSystem } from '../systems/ValidationSystem.js';

export class MainScene extends Phaser.Scene {
  constructor() { super('MainScene'); }

  create() {
    this.platforms = this.physics.add.staticGroup();
    this.enemies = this.physics.add.group();
    this.projectiles = this.physics.add.group();
    this.loot = this.physics.add.group();
    this.player = new Player(this, 120, 500);

    this.systemsBag = {
      chunk: new ProceduralChunkSystem(this),
      spawn: new SpawnSystem(this),
      combat: new CombatSystem(this),
      skills: new SkillSystem(this),
      ui: new UISystem(this),
      save: new SaveSystem(this),
      prog: new ProgressionSystem(this),
      director: new DirectorSystem(this),
      camera: new CameraSystem(this),
      perf: new PerformanceSystem(this),
      talent: new TalentSystem(this),
      validation: new ValidationSystem(this),
      debug: new DebugOverlay(this)
    };

    Object.values(this.systemsBag).forEach((s) => s.init?.());

    this.physics.add.collider(this.player.sprite, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);

    this.physics.add.overlap(this.player.attackHitbox, this.enemies, (_, e) => {
      this.systemsBag.combat.damageEnemy(e, this.player.getAttackData());
    });

    this.physics.add.overlap(this.player.sprite, this.loot, (_, orb) => {
      this.systemsBag.prog.collectLoot(orb.reward);
      orb.destroy();
    });
  }

  update(_, dt) {
    this.player.update(dt);
    Object.values(this.systemsBag).forEach((s) => s.update?.(dt));
    this.enemies.children.iterate((enemy) => enemy?.getData('entity')?.update(dt, this.player.sprite));
  }
}
