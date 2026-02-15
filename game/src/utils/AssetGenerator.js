export default class AssetGenerator {
    constructor(scene) {
        this.scene = scene;
    }

    createGraphics(width, height) {
        return this.scene.make.graphics({ x: 0, y: 0, add: false });
    }

    generateSpecific(key) {
        if (key.startsWith('player')) this.generatePlayer(key);
        else if (key.startsWith('enemy') || key.startsWith('boss')) this.generateEnemy(key);
        else if (key.startsWith('tile')) this.generateTile(key);
        else if (key.startsWith('vfx') || key === 'projectile_basic' || key === 'particle_white') this.generateVFX(key);
        else if (key.startsWith('ui')) this.generateUI(key);
    }

    generatePlayer(key) {
        // Fallback: Blue Box
        const g = this.createGraphics(32, 48);
        g.fillStyle(0x0000ff);
        g.fillRect(0, 0, 32, 48);
        g.generateTexture(key, 32, 48);
        g.destroy();
    }

    generateEnemy(key) {
        const size = key.includes('boss') ? 96 : 32;
        const g = this.createGraphics(size, size);

        if (key.includes('melee')) g.fillStyle(0xff0000); // Red
        else if (key.includes('ranged')) g.fillStyle(0x00ff00); // Green
        else if (key.includes('tank')) g.fillStyle(0x555555); // Grey
        else if (key.includes('boss')) g.fillStyle(0x9900ff); // Purple
        else g.fillStyle(0xffff00); // Yellow default

        g.fillRect(0, 0, size, size);
        g.generateTexture(key, size, size);
        g.destroy();
    }

    generateTile(key) {
        if (key === 'tile_ground') {
            const g = this.createGraphics(32, 32);
            g.fillStyle(0x228822); // Green Grass
            g.fillRect(0, 0, 32, 32);
            g.fillStyle(0x114411);
            g.fillRect(0, 0, 32, 4); // Top Border
            g.generateTexture(key, 32, 32);
            g.destroy();
        } else if (key === 'tile_platform') {
            const g = this.createGraphics(32, 16);
            g.fillStyle(0x885522); // Brown Wood
            g.fillRect(0, 0, 32, 16);
            g.generateTexture(key, 32, 16);
            g.destroy();
        }
    }

    generateVFX(key) {
        if (!this.scene.textures.exists('projectile_basic')) {
            const g = this.createGraphics(16, 16);
            g.fillStyle(0xffff00);
            g.fillCircle(8, 8, 6);
            g.generateTexture('projectile_basic', 16, 16);
            g.destroy();
        }
        if (!this.scene.textures.exists('particle_white')) {
            const g = this.createGraphics(4, 4);
            g.fillStyle(0xffffff);
            g.fillRect(0, 0, 4, 4);
            g.generateTexture('particle_white', 4, 4);
            g.destroy();
        }
    }

    generateUI(key) {
        // ... UI Generation logic remains same ...
        if (!this.scene.textures.exists('ui_bar_frame')) {
            const g = this.createGraphics(200, 20);
            g.lineStyle(2, 0xffffff);
            g.strokeRect(0, 0, 200, 20);
            g.generateTexture('ui_bar_frame', 200, 20);
            g.destroy();
        }
        if (!this.scene.textures.exists('ui_health_fill')) {
            const g = this.createGraphics(196, 16);
            g.fillStyle(0xff0000);
            g.fillRect(0, 0, 196, 16);
            g.generateTexture('ui_health_fill', 196, 16);
            g.destroy();
        }
    }
}
