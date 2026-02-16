import Projectile from '../entities/Projectile.js';

export default class PerformanceSystem {
  constructor(scene) {
    this.scene = scene;
    this.enemyProjectilePool = [];
    this.playerProjectilePool = [];
    this.maxPool = 160;
    this.metrics = {
      activeEntities: 0,
      activeEnemies: 0,
      activeProjectiles: 0,
      pooledProjectiles: 0,
      approxMemoryMB: 0
    };
  }

  init() {
    const groups = this.scene.state.groups;
    for (let i = 0; i < 70; i++) {
      const ep = new Projectile(this.scene, -500, -500, 'proj_enemy');
      ep.recycle();
      groups.enemyProjectiles.add(ep);
      this.enemyProjectilePool.push(ep);

      const pp = new Projectile(this.scene, -500, -500, 'proj_player');
      pp.recycle();
      groups.playerProjectiles.add(pp);
      this.playerProjectilePool.push(pp);
    }
  }

  getProjectile(ownerEnemy) {
    const pool = this.enemyProjectilePool;
    for (const p of pool) {
      if (!p.active) return p;
    }
    if (pool.length < this.maxPool) {
      const np = new Projectile(this.scene, -500, -500, 'proj_enemy');
      np.recycle();
      this.scene.state.groups.enemyProjectiles.add(np);
      pool.push(np);
      return np;
    }
    return pool[Phaser.Math.Between(0, pool.length - 1)];
  }

  getPlayerProjectile() {
    const pool = this.playerProjectilePool;
    for (const p of pool) {
      if (!p.active) return p;
    }
    if (pool.length < this.maxPool) {
      const np = new Projectile(this.scene, -500, -500, 'proj_player');
      np.recycle();
      this.scene.state.groups.playerProjectiles.add(np);
      pool.push(np);
      return np;
    }
    return pool[Phaser.Math.Between(0, pool.length - 1)];
  }

  cleanupOffscreen(now) {
    const cam = this.scene.cameras.main;
    const minX = cam.worldView.x - this.scene.config.world.entityCleanupDistance;
    const maxX = cam.worldView.right + this.scene.config.world.entityCleanupDistance;
    const minY = cam.worldView.y - 600;
    const maxY = cam.worldView.bottom + 800;

    const groups = this.scene.state.groups;

    groups.enemies.getChildren().forEach((e) => {
      if (!e.active) return;
      if (e.x < minX || e.x > maxX || e.y < minY || e.y > maxY) {
        if (!e.isBoss && !e.isMiniBoss) e.destroy();
      }
    });

    [groups.enemyProjectiles, groups.playerProjectiles].forEach((grp) => {
      grp.getChildren().forEach((p) => {
        if (!p.active) return;
        p.update(now);
        if (p.x < minX || p.x > maxX || p.y < minY || p.y > maxY) p.recycle();
      });
    });

    groups.loot.getChildren().forEach((o) => {
      if (!o.active) return;
      if (o.x < minX || o.x > maxX || o.y > maxY) o.destroy();
    });
  }

  updateMetrics() {
    const g = this.scene.state.groups;
    this.metrics.activeEnemies = g.enemies.countActive(true);
    this.metrics.activeProjectiles = g.enemyProjectiles.countActive(true) + g.playerProjectiles.countActive(true);
    this.metrics.activeEntities = this.metrics.activeEnemies + this.metrics.activeProjectiles + g.loot.countActive(true);
    this.metrics.pooledProjectiles = this.enemyProjectilePool.length + this.playerProjectilePool.length;

    const mem = performance?.memory?.usedJSHeapSize;
    this.metrics.approxMemoryMB = mem ? (mem / (1024 * 1024)) : 0;
  }

  update(now) {
    this.cleanupOffscreen(now);
    this.updateMetrics();
  }
}
