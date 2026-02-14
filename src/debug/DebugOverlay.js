export class DebugOverlay {
  constructor(scene){ this.scene=scene; this.visible=false; this.text=scene.add.text(12,80,'',{fontSize:'14px',color:'#82e5ff'}).setScrollFactor(0).setDepth(30); this.text.setVisible(false); }
  update(){
    this.text.setVisible(this.visible);
    if(!this.visible) return;
    const fps = Math.round(this.scene.game.loop.actualFps);
    this.text.setText(`FPS ${fps}\nEnemies ${this.scene.enemies.countActive(true)}\nLoot ${this.scene.loot.countActive(true)}\nChunks ${this.scene.systemsMap.chunks.chunks.size}\nHeap ${(performance.memory?.usedJSHeapSize/1048576||0).toFixed(1)} MB`);
  }
}
