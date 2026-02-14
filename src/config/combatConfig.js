export const COMBAT_CONFIG = {
    // Player Basic Attacks
    player: {
        light1: { damage: 10, startup: 100, active: 66, recovery: 166 }, // ms (frames * 16.6)
        light2: { damage: 12, startup: 83, active: 66, recovery: 183 },
        light3: { damage: 15, startup: 116, active: 83, recovery: 233 },
        heavy:  { damage: 25, startup: 200, active: 100, recovery: 333 },
    },
    // Skills
    skills: {
        ascendingRupture: {
            id: 'ascendingRupture',
            damage: 20,
            cost: 25,
            cooldown: 6500,
            type: 'physical',
            launchForce: -600
        },
        shadowStep: {
            id: 'shadowStep',
            damage: 0,
            cost: 20,
            cooldown: 5000,
            duration: 300,
            distance: 200
        },
        flowBlade: {
            id: 'flowBlade',
            damage: 8,
            hits: 4,
            cost: 30,
            cooldown: 8000,
            type: 'physical'
        },
        freezingPrism: {
            id: 'freezingPrism',
            damage: 15,
            cost: 35,
            cooldown: 11000,
            type: 'ice',
            freezeDuration: 2000
        },
        overloadCore: {
            id: 'overloadCore',
            damage: 80,
            cost: 50,
            cooldown: 16000,
            type: 'lightning',
            radius: 150
        }
    },
    // Status Effects
    status: {
        burn: { damage: 5, interval: 1000, duration: 5000 },
        freeze: { slow: 0.5, duration: 3000 },
        shock: { damageAmp: 1.2, duration: 4000 },
        bleed: { damage: 3, interval: 500, duration: 4000, stackable: true }
    }
};
