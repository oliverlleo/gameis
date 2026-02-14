export default class CameraSystem {
    constructor(scene) {
        this.scene = scene;
        this.camera = scene.cameras.main;

        // Setup initial camera bounds (will update with chunks)
        // this.camera.setBounds(0, 0, Number.MAX_SAFE_INTEGER, scene.game.config.height);

        this.camera.setZoom(1.5); // Pixel art look
    }

    follow(target) {
        this.camera.startFollow(target, true, 0.1, 0.1, 0, 50);
        this.camera.setDeadzone(100, 50);
    }

    shake(intensity = 0.01, duration = 100) {
        this.camera.shake(duration, intensity);
    }

    update() {
        // Dynamic adjustments if needed
    }
}
