export default class AudioSystem {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.5;
        this.masterGain.connect(this.ctx.destination);

        this.musicNodes = [];
        this.isMuted = false;

        // Simple buffers for reused sounds (like noise)
        this.noiseBuffer = this.createNoiseBuffer();
    }

    createNoiseBuffer() {
        const bufferSize = this.ctx.sampleRate * 2; // 2 seconds
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        return buffer;
    }

    playSound(type) {
        if (this.isMuted) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.masterGain);

        const now = this.ctx.currentTime;

        switch (type) {
            case 'jump':
                osc.type = 'square';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
            case 'hit':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(100, now);
                osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.1);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
            case 'shoot':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(50, now + 0.15);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
                break;
            case 'powerup':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.linearRampToValueAtTime(600, now + 0.1);
                osc.frequency.linearRampToValueAtTime(1200, now + 0.3);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
                osc.start(now);
                osc.stop(now + 0.4);
                break;
        }
    }

    playMusic(type) {
        if (this.isMuted) return;
        this.stopMusic();

        // Very simple procedural ambient loop
        // We will just use setInterval-like scheduling for notes?
        // Or just a drone for now to save complexity.

        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.masterGain);

        gain.gain.value = 0.1;

        if (type === 'exploration') {
            osc1.type = 'sine';
            osc1.frequency.value = 220; // A3
            osc2.type = 'triangle';
            osc2.frequency.value = 164.8; // E3
        } else if (type === 'combat') {
             osc1.type = 'sawtooth';
             osc1.frequency.value = 110; // A2
             osc2.type = 'square';
             osc2.frequency.value = 55; // A1
        }

        osc1.start();
        osc2.start();

        this.musicNodes = [osc1, osc2, gain];
    }

    stopMusic() {
        this.musicNodes.forEach(node => {
            if (node.stop) node.stop();
            node.disconnect();
        });
        this.musicNodes = [];
    }
}
