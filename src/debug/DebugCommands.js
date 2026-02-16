export function registerDebugCommands(scene) {
  const input = scene.input.keyboard;

  input.on('keydown-F5', () => {
    const p = scene.state.player;
    p.gainXp(1200);
    p.gainGold(800);
    scene.systemsRef.ui.toast('Debug: +XP +Gold');
  });

  input.on('keydown-F6', () => {
    const p = scene.state.player;
    scene.systemsRef.spawn.spawnMiniBoss(p.x + 300, scene.config.world.groundY - 40);
    scene.systemsRef.ui.toast('Debug: mini-boss spawned');
  });

  input.on('keydown-F7', () => {
    const p = scene.state.player;
    for (let i = 0; i < 12; i++) {
      scene.systemsRef.spawn.spawnMinion(p.x + 120 + i * 24, scene.config.world.groundY - 20);
    }
    scene.systemsRef.ui.toast('Debug: enemy wave');
  });

  input.on('keydown-F8', () => {
    scene.systemsRef.save.save();
    scene.systemsRef.ui.toast('Debug: manual save');
  });
}
