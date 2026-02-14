export default class SaveSystem {
    constructor() {
        this.key = 'infinite_horizon_save';
        this.version = '1.0';
    }

    save(data) {
        const payload = {
            version: this.version,
            timestamp: Date.now(),
            data: data
        };
        try {
            localStorage.setItem(this.key, JSON.stringify(payload));
            console.log('Game Saved');
        } catch (e) {
            console.error('Save failed', e);
        }
    }

    load() {
        try {
            const raw = localStorage.getItem(this.key);
            if (!raw) return null;
            const payload = JSON.parse(raw);
            if (payload.version !== this.version) {
                console.warn('Save version mismatch, might need migration');
                // Migrate logic here if needed
            }
            return payload.data;
        } catch (e) {
            console.error('Load failed', e);
            return null;
        }
    }

    clear() {
        localStorage.removeItem(this.key);
    }
}
