export const testSeeds = {
  baseline: 120031,
  collisionHeavy: 991271,
  bossRush: 550021,
  lootStorm: 882210,
  stress: 734001
};

export function runScenario(scene, name) {
  const p = scene.state.player;
  switch (name) {
    case 'collisionHeavy':
      for (let i = 0; i < 40; i++) {
        const proj = scene.systemsRef.performance.getProjectile();
        proj.fire(p.x + 340 + i * 8, p.y - 50, -420, 0, { owner: 'enemy', damage: 10, lifeMs: 2600, tint: 0xff9c8d }, performance.now());
      }
      break;
    case 'bossRush':
      scene.systemsRef.spawn.spawnMiniBoss(p.x + 280, scene.config.world.groundY - 40);
      scene.systemsRef.spawn.spawnMiniBoss(p.x + 520, scene.config.world.groundY - 40);
      break;
    case 'lootStorm':
      scene.systemsRef.loot.spawnBurst(p.x + 80, p.y - 30, 18, 'epic');
      break;
    case 'stress':
      for (let i = 0; i < 50; i++) {
        scene.systemsRef.spawn.spawnMinion(p.x + Phaser.Math.Between(120, 1000), scene.config.world.groundY - 20);
      }
      break;
    default:
      break;
  }
}
