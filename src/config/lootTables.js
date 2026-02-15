export const LOOT_TABLES = [
    // Weapons
    { id: 'sword_rusty', name: 'Rusty Sword', type: 'weapon', rarity: 'common', damage: 2 },
    { id: 'sword_iron', name: 'Iron Sword', type: 'weapon', rarity: 'uncommon', damage: 5 },
    { id: 'sword_steel', name: 'Steel Sword', type: 'weapon', rarity: 'rare', damage: 8 },
    { id: 'sword_mythril', name: 'Mythril Blade', type: 'weapon', rarity: 'epic', damage: 12 },
    { id: 'sword_dragon', name: 'Dragon Slayer', type: 'weapon', rarity: 'legendary', damage: 20 },
    
    // Armor
    { id: 'armor_leather', name: 'Leather Vest', type: 'armor', rarity: 'common', hp: 10 },
    { id: 'armor_chain', name: 'Chainmail', type: 'armor', rarity: 'uncommon', hp: 20 },
    { id: 'armor_plate', name: 'Plate Armor', type: 'armor', rarity: 'rare', hp: 35 },
    { id: 'armor_obsidian', name: 'Obsidian Plate', type: 'armor', rarity: 'epic', hp: 50 },
    { id: 'armor_ethereal', name: 'Ethereal Robe', type: 'armor', rarity: 'legendary', hp: 80, energy: 20 },

    // Accessories
    { id: 'ring_vit', name: 'Vitality Ring', type: 'accessory', rarity: 'common', hp: 5 },
    { id: 'ring_str', name: 'Strength Ring', type: 'accessory', rarity: 'common', damage: 1 },
    { id: 'ring_swift', name: 'Swift Ring', type: 'accessory', rarity: 'uncommon', speed: 1.05 },
    { id: 'ring_focus', name: 'Focus Ring', type: 'accessory', rarity: 'rare', energy: 10 },
    { id: 'amulet_life', name: 'Amulet of Life', type: 'accessory', rarity: 'epic', hp: 40 },
    { id: 'amulet_power', name: 'Amulet of Power', type: 'accessory', rarity: 'legendary', damage: 10 },

    // Consumables (handled as instant pickup)
    { id: 'potion_small', name: 'Small Potion', type: 'consumable', rarity: 'common', heal: 20 },
    { id: 'potion_large', name: 'Large Potion', type: 'consumable', rarity: 'uncommon', heal: 50 },
    { id: 'elixir', name: 'Elixir', type: 'consumable', rarity: 'rare', heal: 100, energy: 50 },

    // Materials / Misc
    { id: 'scrap', name: 'Metal Scrap', type: 'material', rarity: 'common', value: 5 },
    { id: 'gem_ruby', name: 'Ruby', type: 'material', rarity: 'uncommon', value: 20 },
    { id: 'gem_sapphire', name: 'Sapphire', type: 'material', rarity: 'uncommon', value: 20 },
    { id: 'gem_emerald', name: 'Emerald', type: 'material', rarity: 'rare', value: 50 },
    { id: 'gem_diamond', name: 'Diamond', type: 'material', rarity: 'epic', value: 100 },
    
    // Skill Runes?
    { id: 'rune_fire', name: 'Fire Rune', type: 'rune', rarity: 'rare', status: 'burn' },
    { id: 'rune_ice', name: 'Ice Rune', type: 'rune', rarity: 'rare', status: 'freeze' },
    { id: 'rune_shock', name: 'Shock Rune', type: 'rune', rarity: 'epic', status: 'shock' },
    
    // Boss Drops
    { id: 'soul_boss_a', name: 'Soul of the Guardian', type: 'artifact', rarity: 'legendary', statMult: 1.1 },
    { id: 'soul_boss_b', name: 'Soul of the Ethereal', type: 'artifact', rarity: 'legendary', cooldownReduc: 0.1 }
];
