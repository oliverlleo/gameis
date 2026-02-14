export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;
export const TILE_SIZE = 32;
export const CHUNK_WIDTH = 2048; // As per requirements
export const GRAVITY = 2200;

export const DEPTH = {
    BACKGROUND: 0,
    PARALLAX_1: 1,
    PARALLAX_2: 2,
    GROUND: 10,
    DECORATION: 11,
    PLATFORM: 12,
    LOOT: 15,
    ENEMY: 20,
    PLAYER: 30,
    PROJECTILE: 40,
    VFX: 50,
    UI: 100
};

export const EVENTS = {
    PLAYER_DAMAGED: 'player-damaged',
    PLAYER_HEALED: 'player-healed',
    PLAYER_DIED: 'player-died',
    ENEMY_DAMAGED: 'enemy-damaged',
    ENEMY_DIED: 'enemy-died',
    SCORE_UPDATED: 'score-updated',
    LEVEL_UP: 'level-up',
    BOSS_SPAWN: 'boss-spawn',
    BOSS_PHASE_CHANGE: 'boss-phase-change',
    GAME_OVER: 'game-over',
    PAUSE_TOGGLE: 'pause-toggle'
};
