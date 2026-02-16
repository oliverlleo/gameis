export default class CameraSystem {
  constructor(scene) {
    this.scene = scene;
  }

  init() {
    const cam = this.scene.cameras.main;
    cam.setBackgroundColor(this.scene.config.world.backgroundColor);
    cam.startFollow(this.scene.state.player, true, 0.1, 0.1, -120, -30);
    cam.setRoundPixels(true);
    cam.setZoom(this.scene.config.camera.zoom);

    this.scene.physics.world.setBounds(-1000, -800, 1000000, 3000);
  }

  update() {
    const cam = this.scene.cameras.main;
    const sx = cam.scrollX;
    for (const layer of this.scene.state.parallax) {
      if (!layer.active) continue;
      layer.x = (layer.baseX || layer.x) + sx * (layer.parallaxRatio || 0.2);
    }
  }
}
