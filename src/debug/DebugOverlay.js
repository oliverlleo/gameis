export class DebugOverlay {
  constructor(scene) { this.scene = scene; this.enabled = false; }
  init() {
    this.text = this.scene.add.text(1000, 8, '', { fontSize: '13px', color: '#9f9' }).setScrollFactor(0).setDepth(1000).setVisible(false);
    this.scene.input.keyboard.on('keydown-F3', () => { this.enabled = !this.enabled; this.text.setVisible(this.enabled); });
  }
  update() {
    if (!this.enabled) return;
    const fps = Math.round(this.scene.game.loop.actualFps);
    const e = this.scene.enemies.countActive();
    const chunks = this.scene.systemsBag.chunk.loaded.size;
    const mem = performance.memory ? Math.round(performance.memory.usedJSHeapSize/1048576) + 'MB' : 'n/a';
    this.text.setText(`FPS ${fps}\nEntities ${e}\nChunks ${chunks}\nMemory ${mem}`);
  }
}
