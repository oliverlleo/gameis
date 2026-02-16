export const GAME_VERSION = '2.0.0';
export const SAVE_SCHEMA_VERSION = 2;

export const LAYERS = {
  player: 1,
  ground: 2,
  platform: 4,
  enemy: 8,
  projectile: 16,
  loot: 32
};

export const STATES = {
  idle: 'idle',
  patrol: 'patrol',
  detect: 'detect',
  chase: 'chase',
  attack: 'attack',
  evade: 'evade',
  recover: 'recover',
  retreat: 'retreat',
  dead: 'dead'
};

export const DAMAGE_TYPES = {
  PHYSICAL: 'physical',
  ARCANE: 'arcane',
  ELEMENTAL: 'elemental'
};

export const EVENTS = {
  CHUNK_READY: 'chunk:ready',
  CHUNK_UNLOADED: 'chunk:unloaded',
  ENEMY_DIED: 'enemy:died',
  PLAYER_DAMAGED: 'player:damaged',
  PLAYER_LEVELED: 'player:leveled',
  PLAYER_DEAD: 'player:dead',
  SKILL_CAST: 'skill:cast',
  LOOT_PICKED: 'loot:picked',
  DIRECTOR_PEAK: 'director:peak',
  DIRECTOR_BREATH: 'director:breath',
  TOAST: 'ui:toast',
  TUTORIAL: 'ui:tutorial',
  SAVE_REQUESTED: 'save:requested'
};

export const RARITY_COLORS = {
  common: 0xbfcad8,
  uncommon: 0x77d18c,
  rare: 0x67b5ff,
  epic: 0xbd73ff,
  legendary: 0xffb347
};
