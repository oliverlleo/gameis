import { combatConfig } from '../config/combatConfig.js';

export class CombatSystem {
  constructor(scene) { this.scene = scene; }
  init() {}
  damageEnemy(enemySprite, attack) {
    const entity = enemySprite.getData('entity');
    if (!entity) return;
    const base = combatConfig.frameData[attack.name]?.dmg || 10;
    const crit = Math.random() < combatConfig.crit.chance;
    entity.hurt(Math.round(base * (crit ? combatConfig.crit.multi : 1)));
  }
}
