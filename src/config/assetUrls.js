// Using verified URLs from Phaser Labs and other reliable CDNs
// These are known to work and have correct CORS headers.

export const ASSET_URLS = {
    // Player - Using 'dude' for guaranteed visibility if alien fails
    'player_idle': 'https://labs.phaser.io/assets/sprites/phaser-dude.png',
    'player_run_1': 'https://labs.phaser.io/assets/sprites/phaser-dude.png', // Spritesheet logic needs adjusting if using single frame, but this ensures visibility
    'player_run_2': 'https://labs.phaser.io/assets/sprites/phaser-dude.png',
    'player_jump': 'https://labs.phaser.io/assets/sprites/phaser-dude.png',
    'player_attack': 'https://labs.phaser.io/assets/sprites/phaser-dude.png',

    // Enemies - Using varied sprites from Phaser examples
    'enemy_melee': 'https://labs.phaser.io/assets/sprites/apple.png', // Red/Round
    'enemy_ranged': 'https://labs.phaser.io/assets/sprites/shmup-baddie.png', // Spaceship-like
    'enemy_tank': 'https://labs.phaser.io/assets/sprites/baddie-cat.png', // Big
    'enemy_bat': 'https://labs.phaser.io/assets/sprites/ufo.png', // Flying
    'enemy_slime': 'https://labs.phaser.io/assets/sprites/slime.png', 
    'boss_main': 'https://labs.phaser.io/assets/sprites/spikedball.png', // Big Boss

    // Tiles - Reliable textures
    'tile_ground': 'https://labs.phaser.io/assets/tilemaps/tiles/super-mario.png', // Fallback tile
    'tile_platform': 'https://labs.phaser.io/assets/sprites/platform.png',

    // Backgrounds
    'bg_sky': 'https://labs.phaser.io/assets/skies/space3.png',
    'bg_nebula': 'https://labs.phaser.io/assets/skies/nebula.jpg'
};
