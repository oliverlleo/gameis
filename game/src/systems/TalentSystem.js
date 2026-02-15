import { PROGRESSION_CONFIG } from '../config/progressionConfig.js';

export const TALENTS = [
    // Offensive
    { id: 'sharpness', name: 'Sharpness', desc: '+10% Damage', apply: (p) => p.stats.damage *= 1.1 },
    { id: 'precision', name: 'Precision', desc: '+5% Crit Chance', apply: (p) => p.stats.critChance += 0.05 },
    { id: 'brutality', name: 'Brutality', desc: '+20% Crit Damage', apply: (p) => p.stats.critMultiplier += 0.2 },
    { id: 'haste', name: 'Haste', desc: '+10% Attack Speed', apply: (p) => p.stats.attackSpeed *= 1.1 },
    { id: 'executioner', name: 'Executioner', desc: 'Deal +20% damage to low HP enemies', apply: (p) => p.stats.executeBonus = true },

    // Defensive
    { id: 'vitality', name: 'Vitality', desc: '+20 Max HP', apply: (p) => { p.stats.maxHp += 20; p.stats.hp += 20; } },
    { id: 'iron_skin', name: 'Iron Skin', desc: '+2 Defense', apply: (p) => p.stats.defense += 2 },
    { id: 'evasion', name: 'Evasion', desc: '5% Dodge Chance', apply: (p) => p.stats.dodgeChance = (p.stats.dodgeChance || 0) + 0.05 },
    { id: 'regeneration', name: 'Regeneration', desc: 'Regen 1 HP per sec', apply: (p) => p.stats.regen = (p.stats.regen || 0) + 1 },
    { id: 'guardian', name: 'Guardian', desc: 'Shield on hit (10s cd)', apply: (p) => p.stats.shieldOnHit = true },

    // Utility
    { id: 'greed', name: 'Greed', desc: '+20% Gold Gain', apply: (p) => p.stats.goldMult = (p.stats.goldMult || 1) + 0.2 },
    { id: 'wisdom', name: 'Wisdom', desc: '+20% XP Gain', apply: (p) => p.stats.xpMult = (p.stats.xpMult || 1) + 0.2 },
    { id: 'swiftness', name: 'Swiftness', desc: '+10% Move Speed', apply: (p) => p.stats.moveSpeedMult += 0.1 },
    { id: 'featherweight', name: 'Featherweight', desc: 'Higher Jump', apply: (p) => p.stats.jumpMult = (p.stats.jumpMult || 1) + 0.1 },
    { id: 'magnet', name: 'Magnet', desc: '+50% Pickup Range', apply: (p) => p.stats.pickupRange = (p.stats.pickupRange || 100) * 1.5 },

    // Synergies (Cross-Synergies)
    { id: 'burning_blade', name: 'Burning Blade', desc: 'Attacks apply Burn', req: ['sharpness'], apply: (p) => p.stats.onHitEffect = 'burn' },
    { id: 'frozen_heart', name: 'Frozen Heart', desc: 'Crit freezes enemies', req: ['precision', 'vitality'], apply: (p) => p.stats.critEffect = 'freeze' },
    { id: 'blood_thirst', name: 'Blood Thirst', desc: 'Heal on kill', req: ['brutality'], apply: (p) => p.stats.lifesteal = 0.05 },
    { id: 'static_discharge', name: 'Static Discharge', desc: 'Getting hit shocks enemies', req: ['iron_skin'], apply: (p) => p.stats.thorns = 'shock' },
    { id: 'momentum', name: 'Momentum', desc: 'Speed increases damage', req: ['swiftness', 'haste'], apply: (p) => p.stats.speedToDamage = true },
    { id: 'midas_touch', name: 'Midas Touch', desc: 'Gold heals you', req: ['greed', 'regeneration'], apply: (p) => p.stats.goldHeal = true },
    { id: 'scholar', name: 'Scholar', desc: 'XP increases Skill Damage', req: ['wisdom'], apply: (p) => p.stats.xpToSkillDmg = true },
    { id: 'sky_lord', name: 'Sky Lord', desc: 'Damage up while airborne', req: ['featherweight'], apply: (p) => p.stats.airDamage = true },
    { id: 'tank_buster', name: 'Tank Buster', desc: 'Ignore 50% defense', req: ['precision', 'sharpness'], apply: (p) => p.stats.armorPen = 0.5 }
];

export default class TalentSystem {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.acquired = [];
    }

    canAcquire(talentId) {
        if (this.acquired.includes(talentId)) return false;
        const t = TALENTS.find(t => t.id === talentId);
        if (!t) return false;
        if (t.req) {
            return t.req.every(r => this.acquired.includes(r));
        }
        return true;
    }

    acquire(talentId) {
        if (!this.canAcquire(talentId)) return false;
        const t = TALENTS.find(t => t.id === talentId);
        t.apply(this.player);
        this.acquired.push(talentId);
        return true;
    }

    getAvailable() {
        return TALENTS.filter(t => !this.acquired.includes(t.id) && (!t.req || t.req.every(r => this.acquired.includes(r))));
    }
}
