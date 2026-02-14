export const DebugCommands = { spawnWave: (scene) => { for (let i=0;i<8;i++) scene.events.emit('spawnEnemy',{x:scene.player.sprite.x+450+i*30,y:560,type:'raider'}); } };
