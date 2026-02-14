export class CameraSystem {
  constructor(scene) { this.scene = scene; }
  init() { const cam = this.scene.cameras.main; cam.startFollow(this.scene.player.sprite, true, 0.08, 0.08); cam.setDeadzone(180, 120); }
}
