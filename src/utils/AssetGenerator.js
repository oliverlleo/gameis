export default class AssetGenerator {
    constructor(scene) {
        this.scene = scene;
    }

    generateAll() {
        this.generatePlayer();
        this.generateEnemies();
        this.generateTiles();
        this.generateVFX();
        this.generateUI();
    }

    createGraphics(width, height) {
        const g = this.scene.make.graphics({ x: 0, y: 0, add: false });
        return g;
    }

    generatePlayer() {
        const key = 'player';
        const w = 32;
        const h = 48;

        // Idle Frame
        let g = this.createGraphics(w, h);
        g.fillStyle(0x3366cc); // Blue Body
        g.fillRect(8, 16, 16, 24);
        g.fillStyle(0xffccaa); // Face
        g.fillRect(10, 4, 12, 12);
        g.fillStyle(0x222222); // Feet
        g.fillRect(8, 40, 6, 8);
        g.fillRect(18, 40, 6, 8);
        g.generateTexture('player_idle', w, h);
        g.destroy();

        // Run Frame 1
        g = this.createGraphics(w, h);
        g.fillStyle(0x3366cc);
        g.fillRect(8, 16, 16, 24); // Body
        g.fillStyle(0xffccaa);
        g.fillRect(10, 5, 12, 12); // Head bob
        g.fillStyle(0x222222);
        g.fillRect(4, 38, 8, 8); // Left Leg back
        g.fillRect(20, 38, 8, 8); // Right Leg forward
        g.generateTexture('player_run_1', w, h);
        g.destroy();

        // Run Frame 2
        g = this.createGraphics(w, h);
        g.fillStyle(0x3366cc);
        g.fillRect(8, 16, 16, 24);
        g.fillStyle(0xffccaa);
        g.fillRect(10, 5, 12, 12);
        g.fillStyle(0x222222);
        g.fillRect(8, 38, 8, 8); // Legs switched
        g.fillRect(16, 38, 8, 8);
        g.generateTexture('player_run_2', w, h);
        g.destroy();

        // Attack Frame
        g = this.createGraphics(64, h); // Wider for sword
        g.fillStyle(0x3366cc);
        g.fillRect(8, 16, 16, 24);
        g.fillStyle(0xffccaa);
        g.fillRect(10, 4, 12, 12);
        g.fillStyle(0xdddddd); // Sword
        g.fillRect(24, 20, 30, 6);
        g.generateTexture('player_attack', 64, h);
        g.destroy();

        // Jump Frame
        g = this.createGraphics(w, h);
        g.fillStyle(0x3366cc);
        g.fillRect(8, 16, 16, 24);
        g.fillStyle(0xffccaa);
        g.fillRect(10, 2, 12, 12); // Head up
        g.fillStyle(0x222222);
        g.fillRect(6, 36, 8, 8); // Legs tucked
        g.fillRect(18, 32, 8, 8);
        g.generateTexture('player_jump', w, h);
        g.destroy();
    }

    generateEnemies() {
        // Melee Enemy (Red)
        let g = this.createGraphics(32, 32);
        g.fillStyle(0xcc3333);
        g.fillRect(4, 8, 24, 24); // Body
        g.fillStyle(0x000000);
        g.fillRect(8, 12, 4, 4); // Eye
        g.fillRect(20, 12, 4, 4); // Eye
        g.generateTexture('enemy_melee', 32, 32);
        g.destroy();

        // Ranged Enemy (Green)
        g = this.createGraphics(32, 32);
        g.fillStyle(0x33cc33);
        g.fillTriangle(16, 4, 4, 28, 28, 28);
        g.generateTexture('enemy_ranged', 32, 32);
        g.destroy();

        // Boss (Purple)
        g = this.createGraphics(128, 128);
        g.fillStyle(0x9933cc);
        g.fillRect(16, 16, 96, 96);
        g.fillStyle(0xff0000); // Angry eyes
        g.fillRect(32, 32, 16, 16);
        g.fillRect(80, 32, 16, 16);
        g.generateTexture('boss_main', 128, 128);
        g.destroy();
    }

    generateTiles() {
        // Ground
        let g = this.createGraphics(32, 32);
        g.fillStyle(0x444444);
        g.fillRect(0, 0, 32, 32);
        g.fillStyle(0x333333);
        g.fillRect(0, 0, 32, 4); // Top edge highlight? No, shadow
        g.fillStyle(0x666666); // Top edge
        g.fillRect(0, 0, 32, 2);
        g.generateTexture('tile_ground', 32, 32);
        g.destroy();

        // Platform
        g = this.createGraphics(32, 16);
        g.fillStyle(0x553311);
        g.fillRect(0, 0, 32, 16);
        g.generateTexture('tile_platform', 32, 16);
        g.destroy();
    }

    generateVFX() {
        // Projectile
        let g = this.createGraphics(16, 16);
        g.fillStyle(0xffff00);
        g.fillCircle(8, 8, 6);
        g.generateTexture('projectile_basic', 16, 16);
        g.destroy();

        // Particle
        g = this.createGraphics(4, 4);
        g.fillStyle(0xffffff);
        g.fillRect(0, 0, 4, 4);
        g.generateTexture('particle_white', 4, 4);
        g.destroy();
    }

    generateUI() {
        // Health Bar Frame
        let g = this.createGraphics(200, 20);
        g.lineStyle(2, 0xffffff);
        g.strokeRect(0, 0, 200, 20);
        g.generateTexture('ui_bar_frame', 200, 20);
        g.destroy();

        // Health Bar Fill
        g = this.createGraphics(196, 16);
        g.fillStyle(0xff0000);
        g.fillRect(0, 0, 196, 16);
        g.generateTexture('ui_health_fill', 196, 16);
        g.destroy();
    }
}
