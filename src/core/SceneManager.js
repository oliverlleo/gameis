export default class SceneManager {
  constructor(game) {
    this.game = game;
  }

  start(sceneKey, data = {}) {
    this.game.scene.start(sceneKey, data);
  }

  restart(sceneKey, data = {}) {
    this.game.scene.stop(sceneKey);
    this.game.scene.start(sceneKey, data);
  }
}
