export default class DebugOverlay {
  constructor(scene) {
    this.scene = scene;
    this.visible = false;
    this.text = null;
  }

  init() {
    this.text = this.scene.add.text(this.scene.scale.width - 12, 12, '', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#9df4ff',
      stroke: '#000',
      strokeThickness: 3,
      align: 'right'
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(600).setVisible(false);
  }

  toggle() {
    this.visible = !this.visible;
    if (this.text) this.text.setVisible(this.visible);
  }

  update() {
    if (!this.visible || !this.text) return;
    const perf = this.scene.systemsRef.performance.metrics;
    const fps = this.scene.game.loop.actualFps.toFixed(1);
    const ms = this.scene.game.loop.delta.toFixed(2);
    const chunks = this.scene.systemsRef.chunk.getLoadedChunkCount();
    const player = this.scene.state.player;
    this.text.setText([
      `FPS: ${fps} | frame: ${ms}ms`,
      `Entities: ${perf.activeEntities} (E:${perf.activeEnemies} P:${perf.activeProjectiles})`,
      `Pool proj: ${perf.pooledProjectiles}`,
      `Chunks loaded: ${chunks}`,
      `Mem ~ ${perf.approxMemoryMB ? perf.approxMemoryMB.toFixed(1) : 'n/a'} MB`,
      `Dir intensity: ${this.scene.systemsRef.director.intensity.toFixed(2)} (${this.scene.systemsRef.director.mode})`,
      `Player pos: (${Math.round(player.x)}, ${Math.round(player.y)})`,
      `Distance: ${player.distance}m`,
      `Seed: ${this.scene.runSeed}`
    ].join('\n'));
  }
}
