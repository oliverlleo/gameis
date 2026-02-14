export const rarities = [
  { name: 'common', weight: 56 },
  { name: 'uncommon', weight: 24 },
  { name: 'rare', weight: 12 },
  { name: 'epic', weight: 6 },
  { name: 'legendary', weight: 2 }
];

export const rewardEntries = Array.from({ length: 30 }, (_, i) => ({
  id: `reward_${i+1}`,
  rarity: i < 14 ? 'common' : i < 21 ? 'uncommon' : i < 26 ? 'rare' : i < 29 ? 'epic' : 'legendary',
  effect: `+${2 + (i%7)}% ${['attack','hp','cooldown','crit','energy','burn','shock'][i%7]}`
}));
