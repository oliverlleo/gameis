export default class AudioSystem {
  constructor(scene) {
    this.scene = scene;
    this.buses = { master: 0.8, music: 0.65, sfx: 0.85, ui: 0.8 };
    this.musicState = 'exploration';
    this.ctx = null;
    this.musicOsc = null;
    this.musicGain = null;
    this.duckUntil = 0;
    this.started = false;
  }

  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      this.ctx = null;
    }

    // user gesture unlock
    const unlock = () => {
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      if (!this.started) {
        this.startMusic();
        this.started = true;
      }
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
  }

  setBusVolume(bus, value) {
    this.buses[bus] = Phaser.Math.Clamp(value, 0, 1);
    if (bus === 'music' || bus === 'master') this.updateMusicVolume();
  }

  updateMusicVolume() {
    if (!this.musicGain) return;
    const vol = this.buses.master * this.buses.music;
    this.musicGain.gain.setTargetAtTime(vol * 0.24, this.ctx.currentTime, 0.05);
  }

  setMusicState(state) {
    this.musicState = state;
    if (!this.musicOsc) return;
    if (state === 'exploration') this.musicOsc.frequency.setTargetAtTime(110, this.ctx.currentTime, 0.4);
    if (state === 'combat') this.musicOsc.frequency.setTargetAtTime(148, this.ctx.currentTime, 0.35);
    if (state === 'boss') this.musicOsc.frequency.setTargetAtTime(92, this.ctx.currentTime, 0.25);
  }

  startMusic() {
    if (!this.ctx || this.musicOsc) return;
    const osc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const g = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.value = 110;
    lfo.type = 'sine';
    lfo.frequency.value = 0.2;
    lfoGain.gain.value = 12;

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    osc.connect(g);
    g.connect(this.ctx.destination);
    g.gain.value = 0.0;

    osc.start();
    lfo.start();

    this.musicOsc = osc;
    this.musicGain = g;
    this.updateMusicVolume();
  }

  play(kind) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const g = this.ctx.createGain();
    const o = this.ctx.createOscillator();
    const f = this.kindToFreq(kind);
    o.type = this.kindToType(kind);
    o.frequency.value = f;

    const volBus = ['pickup', 'levelup'].includes(kind) ? 'ui' : 'sfx';
    const vol = this.buses.master * this.buses[volBus] * this.kindToAmp(kind);

    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(vol, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + this.kindToDuration(kind));

    o.connect(g);
    g.connect(this.ctx.destination);
    o.start(now);
    o.stop(now + this.kindToDuration(kind) + 0.02);

    if (['ultimate', 'boss_phase', 'hurt'].includes(kind)) this.duck(0.35, 220);
  }

  duck(amount = 0.3, ms = 250) {
    if (!this.musicGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    const base = this.buses.master * this.buses.music * 0.24;
    this.musicGain.gain.setTargetAtTime(base * amount, now, 0.01);
    this.musicGain.gain.setTargetAtTime(base, now + ms / 1000, 0.08);
  }

  kindToFreq(kind) {
    switch (kind) {
      case 'jump': return 280;
      case 'attack': return 420;
      case 'hit': return 240;
      case 'crit': return 520;
      case 'hurt': return 130;
      case 'skill_cast': return 360;
      case 'dash': return 460;
      case 'enemy_shot': return 210;
      case 'pickup': return 660;
      case 'levelup': return 740;
      case 'ultimate': return 120;
      case 'boss_phase': return 96;
      default: return 300;
    }
  }

  kindToType(kind) {
    if (['hurt', 'ultimate', 'boss_phase'].includes(kind)) return 'sawtooth';
    if (['pickup', 'levelup'].includes(kind)) return 'triangle';
    return 'square';
  }

  kindToDuration(kind) {
    switch (kind) {
      case 'attack': return 0.06;
      case 'hit': return 0.07;
      case 'crit': return 0.11;
      case 'hurt': return 0.16;
      case 'ultimate': return 0.32;
      case 'boss_phase': return 0.25;
      default: return 0.09;
    }
  }

  kindToAmp(kind) {
    switch (kind) {
      case 'boss_phase':
      case 'ultimate': return 0.35;
      case 'hurt': return 0.22;
      case 'levelup': return 0.2;
      default: return 0.12;
    }
  }

  update() {
    const director = this.scene.systemsRef.director;
    if (!director) return;
    if (director.mode === 'peak' && this.musicState !== 'combat') this.setMusicState('combat');
    if (director.mode === 'breath' && this.musicState !== 'exploration') this.setMusicState('exploration');
  }
}
