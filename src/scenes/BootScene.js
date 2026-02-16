import AssetGenerator from '../utils/AssetGenerator.js';
import { ASSET_URLS } from '../config/assetUrls.js';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
        this.missingKeys = [];
    }

    preload() {
        console.log('BootScene: Loading external assets...');
        
        this.load.crossOrigin = 'anonymous';

        this.load.on('loaderror', (file) => {
            console.warn(`Asset failed to load: ${file.key}`);
            this.missingKeys.push(file.key);
        });

        Object.keys(ASSET_URLS).forEach(key => {
            this.load.image(key, ASSET_URLS[key]);
        });
    }

    create() {
        console.log('BootScene: Load complete. Generating fallbacks...');
        const generator = new AssetGenerator(this);

        // Explicitly check essential assets
        const required = [
            'player_idle', 'player_run_1', 'player_run_2', 'player_jump', 'player_attack',
            'enemy_melee', 'enemy_ranged', 'enemy_tank', 'enemy_bat', 'enemy_slime', 'boss_main',
            'tile_ground', 'tile_platform'
        ];

        // If any required asset is missing (failed load), generate it
        required.forEach(key => {
            if (!this.textures.exists(key) || this.missingKeys.includes(key)) {
                console.log(`Generating fallback for: ${key}`);
                generator.generateSpecific(key);
            }
        });

        // Always generate VFX/UI
        generator.generateVFX();
        generator.generateUI();
        
        // Ensure extra enemies have textures (re-use generated or specific)
        const extraEnemies = ['enemy_support', 'enemy_assassin', 'enemy_exploder', 'enemy_shield', 'enemy_ghost'];
        extraEnemies.forEach(key => {
             if (!this.textures.exists(key)) generator.generateSpecific(key);
        });

        this.scene.start('MainMenuScene');
    }
}
