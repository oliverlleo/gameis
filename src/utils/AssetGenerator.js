export default class AssetGenerator {
    constructor(scene) {
        this.scene = scene;
    }

    createGraphics(width, height) {
        return this.scene.make.graphics({ x: 0, y: 0, add: false });
    }

    generateSpecific(key) {
        if (key.startsWith('player')) this.generatePlayer(key);
        else if (key.startsWith('enemy')) this.generateEnemy(key);
        else if (key.startsWith('tile')) this.generateTile(key);
        else if (key.startsWith('boss')) this.generateBoss(key);
        else if (key.startsWith('vfx') || key === 'projectile_basic' || key === 'particle_white') this.generateVFX(key);
        else if (key.startsWith('ui')) this.generateUI(key);
    }

    generatePlayer(key) {
        const w = 32;
        const h = 48;
        const g = this.createGraphics(w, h);

        // Body (Blue)
        g.fillStyle(0x3366cc);
        g.fillRect(8, 16, 16, 24);

        // Head (Flesh)
        g.fillStyle(0xffccaa);
        g.fillRect(10, 4, 12, 12);

        // Face Detail (Eyes)
        g.fillStyle(0x222222);
        g.fillRect(12, 8, 2, 2);
        g.fillRect(18, 8, 2, 2);

        // Legs (Dark Grey)
        g.fillStyle(0x222222);
        if (key.includes('run')) {
             g.fillRect(4, 38, 8, 8);
             g.fillRect(20, 38, 8, 8);
        } else if (key.includes('jump')) {
             g.fillRect(6, 36, 8, 8);
             g.fillRect(18, 32, 8, 8);
        } else { // Idle
             g.fillRect(8, 40, 6, 8);
             g.fillRect(18, 40, 6, 8);
        }

        // Sword (for attack)
        if (key.includes('attack')) {
            g.fillStyle(0xdddddd);
            g.fillRect(24, 20, 30, 6);
        }

        g.generateTexture(key, 64, h); // Wider for sword
        g.destroy();
    }

    generateEnemy(key) {
        const size = 32;
        const g = this.createGraphics(size, size);

        if (key.includes('melee')) {
            // Square Red
            g.fillStyle(0xcc3333);
            g.fillRect(4, 8, 24, 24);
            g.fillStyle(0x000000);
            g.fillRect(8, 12, 4, 4);
            g.fillRect(20, 12, 4, 4);
        } else if (key.includes('ranged')) {
            // Triangle Green
            g.fillStyle(0x33cc33);
            g.fillTriangle(16, 4, 4, 28, 28, 28);
            g.fillStyle(0xffff00); // Eye
            g.fillCircle(16, 16, 4);
        } else if (key.includes('tank')) {
            // Big Grey Block
            g.fillStyle(0x555555);
            g.fillRect(0, 0, 32, 32);
            g.lineStyle(2, 0x000000);
            g.strokeRect(0, 0, 32, 32);
        } else if (key.includes('bat')) {
            // Dark Flying
            g.fillStyle(0x444444);
            g.beginPath();
            g.moveTo(16, 16);
            g.lineTo(0, 8);
            g.lineTo(8, 24);
            g.lineTo(16, 16);
            g.lineTo(24, 24);
            g.lineTo(32, 8);
            g.closePath();
            g.fill();
        } else if (key.includes('slime')) {
            // Green Blob
            g.fillStyle(0x00ff00);
            g.fillCircle(16, 24, 8);
            g.fillStyle(0x00aa00);
            g.fillRect(8, 24, 16, 8);
        } else {
            // Generic fallback (White box)
            g.fillStyle(0xffffff);
            g.fillRect(8, 8, 16, 16);
        }

        g.generateTexture(key, size, size);
        g.destroy();
    }

    generateBoss(key) {
        const size = 128;
        const g = this.createGraphics(size, size);
        g.fillStyle(0x9933cc);
        g.fillRect(16, 16, 96, 96);
        g.fillStyle(0xff0000);
        g.fillRect(32, 32, 16, 16);
        g.fillRect(80, 32, 16, 16);
        g.lineStyle(4, 0x000000);
        g.strokeRect(16, 16, 96, 96);
        g.generateTexture(key, size, size);
        g.destroy();
    }

    generateTile(key) {
        if (key.includes('ground')) {
            const g = this.createGraphics(32, 32);
            g.fillStyle(0x444444);
            g.fillRect(0, 0, 32, 32);
            g.fillStyle(0x666666); // Highlight
            g.fillRect(0, 0, 32, 2);
            g.generateTexture(key, 32, 32);
            g.destroy();
        } else if (key.includes('platform')) {
            const g = this.createGraphics(32, 16);
            g.fillStyle(0x553311);
            g.fillRect(0, 0, 32, 16);
            g.fillStyle(0x774422); // Highlight
            g.fillRect(0, 0, 32, 2);
            g.generateTexture(key, 32, 16);
            g.destroy();
        }
    }

    generateVFX(key) {
        if (key === 'projectile_basic' || !key) {
            if (!this.scene.textures.exists('projectile_basic')) {
                const g = this.createGraphics(16, 16);
                g.fillStyle(0xffff00);
                g.fillCircle(8, 8, 6);
                g.generateTexture('projectile_basic', 16, 16);
                g.destroy();
            }
        }
        if (key === 'particle_white' || !key) {
            if (!this.scene.textures.exists('particle_white')) {
                const g = this.createGraphics(4, 4);
                g.fillStyle(0xffffff);
                g.fillRect(0, 0, 4, 4);
                g.generateTexture('particle_white', 4, 4);
                g.destroy();
            }
        }
    }

    generateUI(key) {
        if (key === 'ui_bar_frame' || !key) {
            if (!this.scene.textures.exists('ui_bar_frame')) {
                const g = this.createGraphics(200, 20);
                g.lineStyle(2, 0xffffff);
                g.strokeRect(0, 0, 200, 20);
                g.generateTexture('ui_bar_frame', 200, 20);
                g.destroy();
            }
        }
        if (key === 'ui_health_fill' || !key) {
            if (!this.scene.textures.exists('ui_health_fill')) {
                const g = this.createGraphics(196, 16);
                g.fillStyle(0xff0000);
                g.fillRect(0, 0, 196, 16);
                g.generateTexture('ui_health_fill', 196, 16);
                g.destroy();
            }
        }
    }
}
