export const DebugCommands = {
  spawnWave(scene){ for(let i=0;i<12;i++) scene.systemsMap.spawn.timer=0; },
  grantGold(scene){ scene.systemsMap.economy.addGold(500); },
};
