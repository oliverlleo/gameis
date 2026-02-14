export default class SceneManager {
    constructor(game) {
        this.game = game;
    }

    startParams(sceneKey, data) {
        this.game.scene.start(sceneKey, data);
    }

    launchUI() {
        this.game.scene.launch('UIScene');
    }

    stopUI() {
        this.game.scene.stop('UIScene');
    }

    pauseGame() {
        this.game.scene.pause('GameScene');
        this.game.scene.pause('UIScene');
        this.game.scene.launch('PauseScene'); // If implemented
    }

    resumeGame() {
        this.game.scene.resume('GameScene');
        this.game.scene.resume('UIScene');
        this.game.scene.stop('PauseScene');
    }
}
