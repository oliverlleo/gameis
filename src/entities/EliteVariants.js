export function applyEliteVariant(enemy, variant) {
  enemy.isElite = true;
  enemy.eliteMutator = variant.mutator;
  enemy.maxHp = Math.round(enemy.maxHp * variant.hpMult);
  enemy.hp = enemy.maxHp;
  enemy.attackDamage = Math.round(enemy.attackDamage * variant.dmgMult);
  enemy.setTint(0xffc857);
  enemy.setScale(1.08);

  if (variant.mutator === 'shield') {
    enemy.resistances.physical += 0.12;
    enemy.resistances.elemental += 0.1;
  } else if (variant.mutator === 'reflect') {
    enemy.reflectPct = 0.12;
  } else if (variant.mutator === 'aura') {
    enemy.auraRadius = 190;
    enemy.auraBuff = 0.18;
  } else if (variant.mutator === 'spawnlings') {
    enemy.spawnlingOnHitChance = 0.1;
  }
  return enemy;
}
