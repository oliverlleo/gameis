import AssetGenerator from '../utils/AssetGenerator.js';
import { ASSET_URLS } from '../config/assetUrls.js';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
        this.missingKeys = [];
    }

    preload() {
        console.log('BootScene: Loading external assets...');
        
        // Ensure cross-origin loading works
        this.load.crossOrigin = 'anonymous';

        // Register load error handler
        this.load.on('loaderror', (file) => {
            console.warn(`Asset failed to load: ${file.key}`);
            this.missingKeys.push(file.key);
        });

        // Queue all external assets
        Object.keys(ASSET_URLS).forEach(key => {
            this.load.image(key, ASSET_URLS[key]);
        });
    }

    create() {
        console.log('BootScene: Load complete. Generating missing assets...');
        const generator = new AssetGenerator(this);

        // List of keys we expect to have textures for
        const essentialKeys = Object.keys(ASSET_URLS);

        // Check which ones are missing (either failed load or not provided)
        essentialKeys.forEach(key => {
            if (!this.textures.exists(key)) {
                console.log(`Generating fallback for: ${key}`);
                generator.generateSpecific(key);
            }
        });

        // Always generate procedural-only assets (VFX, UI)
        generator.generateVFX();
        generator.generateUI();
        
        // Extra generation for assets not in URL list (e.g. enemy variants sharing textures)
        // enemy_support, enemy_assassin, etc. might re-use textures or need generation
        // For now, AssetGenerator handles them if they are not in ASSET_URLS
        // But AssetGenerator.generateEnemies() generated everything.
        // We should split AssetGenerator to be granular.
        
        // Let's ensure ALL enemies have textures.
        // If 'enemy_support' is not in ASSET_URLS, we must generate it.
        const extraEnemies = ['enemy_support', 'enemy_assassin', 'enemy_exploder', 'enemy_shield', 'enemy_ghost'];
        extraEnemies.forEach(key => {
             if (!this.textures.exists(key)) generator.generateSpecific(key);
        });

        this.scene.start('MainMenuScene');
    }
}
