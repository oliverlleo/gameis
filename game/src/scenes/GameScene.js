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
import BackgroundSystem from '../systems/BackgroundSystem.js';
import DirectorSystem from '../systems/DirectorSystem.js';
import AISystem from '../systems/AISystem.js';
import SpawnSystem from '../systems/SpawnSystem.js';
import AudioSystem from '../systems/AudioSystem.js';
import SaveSystem from '../systems/SaveSystem.js';
import eventBus from '../core/EventBus.js';
import { GAME_HEIGHT, EVENTS } from '../core/Constants.js';

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
        this.projectilesGroup = this.physics.add.group({ runChildUpdate: true });

        // Player (Create first so systems can reference it)
        this.player = new Player(this, 100, GAME_HEIGHT - 200);
        if (this.loadData && this.loadData.player) {
            this.player.stats = { ...this.player.stats, ...this.loadData.player.stats };
            this.player.sprite.x = this.loadData.player.x || 100;
            this.player.sprite.y = this.loadData.player.y || GAME_HEIGHT - 200;
        }

        // Systems
        this.inputSystem = new InputSystem(this);
        this.cameraSystem = new CameraSystem(this);
        this.backgroundSystem = new BackgroundSystem(this);
        this.combatSystem = new CombatSystem(this);
        this.spawnSystem = new SpawnSystem(this); // Now we have spawn system instance available
        this.chunkSystem = new ProceduralChunkSystem(this); // Passes scene, uses this.spawnSystem
        this.directorSystem = new DirectorSystem(this);
        this.aiSystem = new AISystem(this);
        this.audioSystem = new AudioSystem();
        this.saveSystem = new SaveSystem();

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
            this.talentSystem.acquired.forEach(id => {
                const t = TALENTS.find(talent => talent.id === id);
                if (t) t.apply(this.player);
            });
        }

        // Collisions
        this.physics.add.collider(this.player.sprite, this.groundGroup);
        this.physics.add.collider(this.enemiesGroup, this.groundGroup);

        // Combat Collisions
        this.physics.add.overlap(this.player.sprite, this.enemiesGroup, (playerSprite, enemySprite) => {
             if (enemySprite.entity && enemySprite.entity.isAlive) {
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
        this.shopListener = () => {
            this.scene.pause('GameScene');
            this.scene.launch('ShopScene');
        };
        eventBus.on('open-shop', this.shopListener);

        // Audio Listeners (Stored reference for removal)
        this.onPlayerHit = () => this.audioSystem.playSound('player-hit');
        this.onEnemyHit = () => this.audioSystem.playSound('enemy-hit');
        this.onSkillUsed = () => this.audioSystem.playSound('shoot');
        this.onLoot = () => this.audioSystem.playSound('loot');
        this.onBossSpawn = () => this.audioSystem.playMusic('combat');

        eventBus.on(EVENTS.PLAYER_DAMAGED, this.onPlayerHit);
        eventBus.on(EVENTS.ENEMY_DAMAGED, this.onEnemyHit);
        eventBus.on('skill-used', this.onSkillUsed);
        eventBus.on('gold-gained', this.onLoot);
        eventBus.on('boss-spawn', this.onBossSpawn);

        // Start Music
        this.audioSystem.playMusic('exploration');

        // Autosave
        this.autosaveEvent = this.time.addEvent({
            delay: 30000,
            loop: true,
            callback: () => this.saveGame()
        });

        // Cleanup on shutdown
        this.events.once('shutdown', this.shutdown, this);
    }

    saveGame() {
        if (!this.player || !this.progressionSystem) return;

        const data = {
            player: {
                x: this.player.sprite.x,
                y: this.player.sprite.y,
                stats: this.player.stats
            },
            progression: {
                level: this.progressionSystem.level,
                xp: this.progressionSystem.currentXP,
                xpToNext: this.progressionSystem.xpToNext
            },
            economy: {
                gold: this.economySystem.gold
            },
            talents: this.talentSystem.acquired,
            seed: this.chunkSystem.seed
        };
        this.saveSystem.save(data);
    }

    shutdown() {
        // Remove Listeners
        eventBus.off('open-shop', this.shopListener);
        eventBus.off(EVENTS.PLAYER_DAMAGED, this.onPlayerHit);
        eventBus.off(EVENTS.ENEMY_DAMAGED, this.onEnemyHit);
        eventBus.off('skill-used', this.onSkillUsed);
        eventBus.off('gold-gained', this.onLoot);
        eventBus.off('boss-spawn', this.onBossSpawn);

        // System Cleanups
        if (this.progressionSystem) this.progressionSystem.destroy();
        if (this.economySystem) this.economySystem.destroy();
        if (this.lootSystem) this.lootSystem.destroy();

        // Stop music
        if (this.audioSystem) this.audioSystem.stopMusic();

        if (this.autosaveEvent) this.autosaveEvent.remove();
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
            this.directorSystem.update(time, delta);
            this.aiSystem.update(time, delta);
        }

        this.cameraSystem.update();
        this.backgroundSystem.update();
        this.debugOverlay.update();

        // Kill plane
        if (this.player.sprite.y > GAME_HEIGHT + 100) {
            this.scene.start('GameOverScene');
        }
    }
}
