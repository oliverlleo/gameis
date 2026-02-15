import eventBus from '../core/EventBus.js';

export default class EconomySystem {
    constructor(scene) {
        this.scene = scene;
        this.gold = 0;
        
        eventBus.on('gold-gained', this.addGold, this);
        eventBus.on('item-bought', this.spendGold, this);
    }

    addGold(amount) {
        this.gold += amount;
        eventBus.emit('gold-updated', this.gold);
    }

    spendGold(amount) {
        if (this.gold >= amount) {
            this.gold -= amount;
            eventBus.emit('gold-updated', this.gold);
            return true;
        }
        return false;
    }
}
