export default class CollisionSystem {
  constructor(scene) {
    this.scene = scene;
  }

  bind() {
    const { player, groups } = this.scene.state;

    this.scene.physics.add.collider(player, groups.terrain);
    this.scene.physics.add.collider(groups.enemies, groups.terrain);

    this.scene.physics.add.overlap(player, groups.loot, (p, orb) => {
      this.scene.systemsRef.loot.collectOrb(orb);
    });

    // Melee contact damage handled softly
    this.scene.physics.add.overlap(player, groups.enemies, (p, e) => {
      const now = performance.now();
      if (e.state === 'attack' && e.canDealContactDamage) {
        p.receiveDamage(e.attackDamage * (1 + (e.attackDamageBuff || 0)), now, 120 * Math.sign(p.x - e.x), -90);
      }
    });

    this.scene.physics.add.overlap(player, groups.enemyProjectiles, (p, proj) => {
      if (!proj.active) return;
      const now = performance.now();
      p.receiveDamage(proj.damage, now, proj.body.velocity.x * 0.06, -70);
      proj.recycle();
      this.scene.systemsRef.audio.play('hurt');
    });

    this.scene.physics.add.overlap(groups.enemies, groups.playerProjectiles, (enemy, proj) => {
      if (!proj.active || !enemy.getAlive?.()) return;
      const now = performance.now();
      this.scene.systemsRef.combat.applyPlayerDamageToEnemy(enemy, proj.damage, proj.damageType, now, proj.statusPayload);
      proj.recycle();
    });
  }

  update(deltaMs) {
    const dt = Math.max(0.001, deltaMs / 1000);
    const groups = this.scene.state.groups;
    const terrain = groups.terrain.getChildren();

    const sweep = (proj) => {
      if (!proj.active || !proj.body) return;
      const vx = proj.body.velocity.x;
      const vy = proj.body.velocity.y;
      if (Math.abs(vx) < 20 && Math.abs(vy) < 20) return;

      const x0 = proj.prevX ?? (proj.x - vx * dt);
      const y0 = proj.prevY ?? (proj.y - vy * dt);
      const x1 = proj.x;
      const y1 = proj.y;

      for (const t of terrain) {
        const r = t.getBounds();
        if (Phaser.Geom.Intersects.LineToRectangle(new Phaser.Geom.Line(x0, y0, x1, y1), r)) {
          proj.recycle();
          break;
        }
      }
      proj.prevX = proj.x;
      proj.prevY = proj.y;
    };

    groups.enemyProjectiles.getChildren().forEach(sweep);
    groups.playerProjectiles.getChildren().forEach(sweep);
  }
}
