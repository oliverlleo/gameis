export const BIOME_CONFIG = {
    ruins: {
        id: 'ruins',
        backgroundColor: '#1a1a1a',
        tileColor: 0x444444,
        platformColor: 0x553311,
        enemies: ['enemy_melee', 'enemy_ranged', 'enemy_bat', 'enemy_slime'],
        hazardChance: 0.1
    },
    forest: {
        id: 'forest',
        backgroundColor: '#001a00',
        tileColor: 0x224422,
        platformColor: 0x335533,
        enemies: ['enemy_melee', 'enemy_ranged', 'enemy_shield', 'enemy_support'],
        hazardChance: 0.2
    },
    forge: {
        id: 'forge',
        backgroundColor: '#220000',
        tileColor: 0x442222,
        platformColor: 0x663333,
        enemies: ['enemy_tank', 'enemy_exploder', 'enemy_melee', 'enemy_ranged'],
        hazardChance: 0.3
    },
    ethereal: {
        id: 'ethereal',
        backgroundColor: '#110022',
        tileColor: 0x331133,
        platformColor: 0x552255,
        enemies: ['enemy_ghost', 'enemy_assassin', 'enemy_ranged', 'enemy_bat'],
        hazardChance: 0.4
    }
};
