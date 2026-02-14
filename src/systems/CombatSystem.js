import { combatConfig } from '../config/combatConfig.js';

export class CombatSystem {
  constructor(scene) { this.scene = scene; }
  init() {}

  damageEnemy(enemySprite, attack) {
    const entity = enemySprite.getData('entity');
    if (!entity) return;

    const frame = combatConfig.frameData[attack.name] || combatConfig.frameData.light1;
    let base = frame.dmg;

    const talents = this.scene.systemsBag.talent;
    if (talents.has('edge_1') && attack.name.includes('light')) base *= 1.08;
    if (talents.has('edge_2') && attack.name === 'heavy') base *= 1.12;

    const crit = Math.random() < combatConfig.crit.chance;
    const dealt = Math.round(base * (crit ? combatConfig.crit.multi : 1));
    entity.hurt(dealt);
  }
}
