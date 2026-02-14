import { GAME_WIDTH, GAME_HEIGHT } from '../core/Constants.js';

export default class BackgroundSystem {
    constructor(scene) {
        this.scene = scene;
        this.layers = [];

        // Use external images if loaded, otherwise generate
        this.createLayers();
    }

    createLayers() {
        // Sky Layer (Static)
        const skyKey = this.scene.textures.exists('bg_sky') ? 'bg_sky' : null;
        if (skyKey) {
            this.scene.add.image(0, 0, skyKey)
                .setOrigin(0, 0)
                .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
                .setScrollFactor(0)
                .setDepth(-10);
        } else {
            // Procedural Gradient Sky
            const g = this.scene.make.graphics({ x: 0, y: 0, add: false });
            g.fillGradientStyle(0x000033, 0x000033, 0x110044, 0x110044, 1);
            g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
            g.generateTexture('bg_sky_proc', GAME_WIDTH, GAME_HEIGHT);
            this.scene.add.image(0, 0, 'bg_sky_proc')
                .setOrigin(0, 0)
                .setScrollFactor(0)
                .setDepth(-10);
            g.destroy();
        }

        // Parallax Layers
        // Nebula
        const nebulaKey = this.scene.textures.exists('bg_nebula') ? 'bg_nebula' : null;
        if (nebulaKey) {
            const nebula = this.scene.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, nebulaKey)
                .setOrigin(0, 0)
                .setScrollFactor(0)
                .setDepth(-5)
                .setAlpha(0.6);

            this.layers.push({ sprite: nebula, speed: 0.1 });
        } else {
            // Procedural Stars
            const g = this.scene.make.graphics({ x: 0, y: 0, add: false });
            g.fillStyle(0xffffff, 1);
            for(let i=0; i<200; i++) {
                g.fillCircle(Math.random() * GAME_WIDTH, Math.random() * GAME_HEIGHT, Math.random() * 2);
            }
            g.generateTexture('bg_stars_proc', GAME_WIDTH, GAME_HEIGHT);
            const stars = this.scene.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, 'bg_stars_proc')
                .setOrigin(0, 0)
                .setScrollFactor(0)
                .setDepth(-5);
            g.destroy();

            this.layers.push({ sprite: stars, speed: 0.05 });
        }
    }

    update() {
        const camX = this.scene.cameras.main.scrollX;

        this.layers.forEach(layer => {
            layer.sprite.tilePositionX = camX * layer.speed;
        });
    }
}
