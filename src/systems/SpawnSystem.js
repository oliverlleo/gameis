import { spawnConfig } from '../config/spawnConfig.js';
import { EnemyMelee } from '../entities/EnemyMelee.js';
import { EnemyRanged } from '../entities/EnemyRanged.js';
import { EnemyTank } from '../entities/EnemyTank.js';
import { EnemySupport } from '../entities/EnemySupport.js';
import { EnemySummoner } from '../entities/EnemySummoner.js';
import { EnemyAssassin } from '../entities/EnemyAssassin.js';
import { BossA } from '../entities/BossA.js';
import { BossB } from '../entities/BossB.js';

export class SpawnSystem {
  constructor(scene) {
    this.scene = scene;
    this.next = 0;
    this.boss1Spawned = false;
    this.boss2Spawned = false;
  }

  init() {
    this.scene.events.on('spawnEnemy', ({ x, y, type }) => this.spawnByType(x, y, type));
  }

  spawnByType(x, y, type) {
    let entity;
    if (['scout', 'raider', 'lurker'].includes(type)) entity = new EnemyMelee(this.scene, x, y, type);
    else if (['gunner', 'sentinel', 'wraith'].includes(type)) entity = new EnemyRanged(this.scene, x, y, type);
    else if (type === 'brute') entity = new EnemyTank(this.scene, x, y);
    else if (type === 'hexer') entity = new EnemySupport(this.scene, x, y);
    else if (type === 'caller') entity = new EnemySummoner(this.scene, x, y);
    else if (type === 'stabber') entity = new EnemyAssassin(this.scene, x, y);
    else entity = new EnemyMelee(this.scene, x, y, 'raider');
    this.scene.enemies.add(entity.sprite);
  }

  update() {
    const now = this.scene.time.now;
    const p = this.scene.player.sprite;
    const dist = p.x;

    if (!this.boss1Spawned && dist > 5200) {
      this.boss1Spawned = true;
      this.scene.enemies.add(new BossA(this.scene, p.x + 700, 520).sprite);
    }
    if (!this.boss2Spawned && dist > 10800) {
      this.boss2Spawned = true;
      this.scene.enemies.add(new BossB(this.scene, p.x + 700, 520).sprite);
    }

    if (now < this.next) return;

    const intensity = this.scene.systemsBag.director.intensity;
    const interval = Phaser.Math.Linear(1600, 700, intensity);
    this.next = now + interval;

    const x = p.x + 780 + Math.random() * 340;
    const y = 560;
    if (Phaser.Math.Distance.Between(x, y, p.x, p.y) < spawnConfig.minSpawnDist) return;

    const roll = Math.random();
    if (roll < 0.28) this.spawnByType(x, y, 'raider');
    else if (roll < 0.46) this.spawnByType(x, y, 'gunner');
    else if (roll < 0.62) this.spawnByType(x, y, 'brute');
    else if (roll < 0.76) this.spawnByType(x, y, 'hexer');
    else if (roll < 0.9) this.spawnByType(x, y, 'caller');
    else this.spawnByType(x, y, 'stabber');
  }
}
