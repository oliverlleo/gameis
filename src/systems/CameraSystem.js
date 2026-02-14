export class CameraSystem {
  constructor(scene){ this.scene=scene; }
  init(){ this.scene.cameras.main.startFollow(this.scene.player, true, 0.1, 0.1); this.scene.cameras.main.setBounds(-10000,0,200000,720); }
}
