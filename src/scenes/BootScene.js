import AssetGenerator from '../utils/AssetGenerator.js';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        console.log('BootScene: Generating assets...');
        const generator = new AssetGenerator(this);
        generator.generateAll();
    }

    create() {
        console.log('BootScene: Assets generated.');
        // Add a small delay or check? No need, synchronous generation.
        this.scene.start('MainMenuScene');
    }
}
