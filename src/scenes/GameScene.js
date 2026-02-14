import Player from '../entities/Player.js';
import InputSystem from '../systems/InputSystem.js';
import CameraSystem from '../systems/CameraSystem.js';
import ProceduralChunkSystem from '../systems/ProceduralChunkSystem.js';
import CombatSystem from '../systems/CombatSystem.js';
import ProgressionSystem from '../systems/ProgressionSystem.js';
import EconomySystem from '../systems/EconomySystem.js';
import LootSystem from '../systems/LootSystem.js';
import TalentSystem, { TALENTS } from '../systems/TalentSystem.js';
import DebugOverlay from '../debug/DebugOverlay.js';
import { GAME_HEIGHT } from '../core/Constants.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init(data) {
        this.loadData = data ? data.loadData : null;
    }

    create() {
        // Groups
        this.groundGroup = this.physics.add.staticGroup();
        this.enemiesGroup = this.physics.add.group({ runChildUpdate: true });
        this.projectilesGroup = this.physics.add.group({ runChildUpdate: true }); // Shared group?

        // Player (Create first so systems can reference it)
        this.player = new Player(this, 100, GAME_HEIGHT - 200);
        if (this.loadData && this.loadData.player) {
            // Restore player stats
            this.player.stats = { ...this.player.stats, ...this.loadData.player.stats };
            this.player.sprite.x = this.loadData.player.x || 100;
            this.player.sprite.y = this.loadData.player.y || GAME_HEIGHT - 200;
        }

        // Systems
        this.inputSystem = new InputSystem(this);
        this.cameraSystem = new CameraSystem(this);
        this.combatSystem = new CombatSystem(this);
        this.chunkSystem = new ProceduralChunkSystem(this);
        this.progressionSystem = new ProgressionSystem(this, this.player);
        if (this.loadData && this.loadData.progression) {
            this.progressionSystem.level = this.loadData.progression.level;
            this.progressionSystem.currentXP = this.loadData.progression.xp;
            this.progressionSystem.xpToNext = this.loadData.progression.xpToNext;
        }

        this.economySystem = new EconomySystem(this);
        if (this.loadData && this.loadData.economy) {
            this.economySystem.gold = this.loadData.economy.gold;
        }

        this.lootSystem = new LootSystem(this);
        this.talentSystem = new TalentSystem(this, this.player);
        if (this.loadData && this.loadData.talents) {
            this.talentSystem.acquired = this.loadData.talents;
            // Re-apply talents
            this.talentSystem.acquired.forEach(id => {
                const t = TALENTS.find(talent => talent.id === id);
                if (t) t.apply(this.player);
            });
        }

        // Collisions
        this.physics.add.collider(this.player.sprite, this.groundGroup);
        this.physics.add.collider(this.enemiesGroup, this.groundGroup);

        // Combat Collisions
        // Player Attack Overlap (Handled by events or manually)
        // Enemy Contact Damage
        this.physics.add.overlap(this.player.sprite, this.enemiesGroup, (playerSprite, enemySprite) => {
             // Simple contact damage
             if (enemySprite.entity && enemySprite.entity.active) {
                 this.combatSystem.handleHit(enemySprite, playerSprite);
             }
        });

        // Camera
        this.cameraSystem.follow(this.player.sprite);

        // UI
        this.scene.launch('UIScene');

        // Debug
        this.debugOverlay = new DebugOverlay(this);

        // Listen for Shop
        this.scene.events.on('open-shop', () => {
            this.scene.pause('GameScene');
            this.scene.launch('ShopScene');
        });
    }

    getEnemies() {
        return this.enemiesGroup.getChildren().map(sprite => sprite.entity).filter(e => e);
    }

    update(time, delta) {
        this.inputSystem.update(time, delta);
        const inputs = this.inputSystem.getInputs();

        if (this.player) {
            this.player.update(time, delta, inputs);
            this.chunkSystem.update(this.player.sprite.x);
        }

        this.cameraSystem.update();
        this.debugOverlay.update();

        // Kill plane
        if (this.player.sprite.y > GAME_HEIGHT + 100) {
            this.scene.start('GameOverScene');
        }
    }
}
