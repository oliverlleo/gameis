export default class DebugOverlay {
    constructor(scene) {
        this.scene = scene;
        this.visible = false;
        this.text = scene.add.text(10, 100, '', { font: '12px monospace', fill: '#00ff00', backgroundColor: '#000000' });
        this.text.setScrollFactor(0);
        this.text.setDepth(1000);

        scene.input.keyboard.on('keydown-F3', () => {
            this.visible = !this.visible;
            this.text.setVisible(this.visible);
        });
    }

    update() {
        if (!this.visible) return;

        const loop = this.scene.game.loop;
        const fps = loop.actualFps;
        const player = this.scene.player;
        const enemies = this.scene.enemiesGroup ? this.scene.enemiesGroup.getLength() : 0;
        const chunks = this.scene.chunkSystem ? this.scene.chunkSystem.activeChunks.length : 0;

        this.text.setText([
            `FPS: ${fps.toFixed(2)}`,
            `Player X: ${Math.floor(player.sprite.x)} Y: ${Math.floor(player.sprite.y)}`,
            `State: ${player.state}`,
            `Grounded: ${player.isGrounded}`,
            `Enemies: ${enemies}`,
            `Chunks: ${chunks}`,
            `Memory: ${window.performance && window.performance.memory ? (window.performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + ' MB' : 'N/A'}`
        ]);
    }
}
