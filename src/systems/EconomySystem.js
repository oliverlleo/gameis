import { economyConfig } from '../config/economyConfig.js';

export default class EconomySystem {
  constructor(scene) {
    this.scene = scene;
    this.shopRefreshCount = 0;
    this.rerollCount = 0;
    this.skillUpgradeCounts = {
      ascendingRupture: 0,
      shadowStep: 0,
      flowBlade: 0,
      freezingPrism: 0,
      overloadCore: 0
    };
  }

  getRefreshCost() {
    return Math.round(economyConfig.shop.baseRefreshCost * Math.pow(economyConfig.shop.refreshGrowth, this.shopRefreshCount));
  }

  refreshShop() {
    const p = this.scene.state.player;
    const cost = this.getRefreshCost();
    if (p.gold < cost) return false;
    p.gold -= cost;
    this.shopRefreshCount += 1;
    this.scene.systemsRef.ui.toast(`Shop refreshed (-${cost}g)`);
    return true;
  }

  buyHeal25() {
    const p = this.scene.state.player;
    const cost = economyConfig.shop.heal25Cost;
    if (p.gold < cost) return false;
    p.gold -= cost;
    p.hp = Math.min(p.maxHp, p.hp + Math.round(p.maxHp * 0.25));
    this.scene.systemsRef.ui.toast(`Heal purchased (-${cost}g)`);
    return true;
  }

  buyRandomTalent() {
    const p = this.scene.state.player;
    const cost = economyConfig.shop.randomTalentCost;
    if (p.gold < cost) return false;
    p.gold -= cost;
    this.scene.systemsRef.talent.grantRandomTalent('uncommon');
    this.scene.systemsRef.ui.toast(`Talent acquired (-${cost}g)`);
    return true;
  }

  buySkillUpgrade(skillId) {
    const p = this.scene.state.player;
    const n = this.skillUpgradeCounts[skillId] ?? 0;
    const cost = Math.round(economyConfig.shop.skillUpgradeBase * Math.pow(economyConfig.shop.skillUpgradeGrowth, n));
    if (p.gold < cost) return false;
    p.gold -= cost;
    p.skillLevels[skillId] = Math.min(2, (p.skillLevels[skillId] || 1) + 1);
    this.skillUpgradeCounts[skillId] = n + 1;
    this.scene.systemsRef.ui.toast(`${skillId} upgraded (-${cost}g)`);
    return true;
  }

  reforgeTalents() {
    const p = this.scene.state.player;
    const cost = economyConfig.shop.passiveReforgeCost;
    if (p.gold < cost) return false;
    p.gold -= cost;
    this.scene.systemsRef.talent.reforgeOneTalent();
    this.scene.systemsRef.ui.toast(`Passive reforged (-${cost}g)`);
    return true;
  }

  rerollOffer() {
    const p = this.scene.state.player;
    const cost = Math.round(economyConfig.reroll.start * Math.pow(economyConfig.reroll.growth, this.rerollCount));
    if (p.gold < cost) return false;
    p.gold -= cost;
    this.rerollCount += 1;
    this.scene.systemsRef.talent.offerReroll();
    this.scene.systemsRef.ui.toast(`Reroll performed (-${cost}g)`);
    return true;
  }
}
