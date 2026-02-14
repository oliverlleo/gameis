export const EliteVariants = {
  aura: (e) => { e.hp *= 1.7; e.maxHp = e.hp; e.speed *= 1.15; e.mutator='aura'; },
  shield: (e) => { e.hp *= 2; e.maxHp = e.hp; e.mutator='shield'; },
  reflect: (e) => { e.hp *= 1.5; e.maxHp = e.hp; e.mutator='reflect'; },
  summon: (e) => { e.hp *= 1.4; e.maxHp = e.hp; e.mutator='summon'; },
};
