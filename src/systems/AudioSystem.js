export class AudioSystem {
  constructor(scene){ this.scene=scene; }
  init(){ Howler.volume(0.8); }
  update(){ const master=Number(document.getElementById('audio-master')?.value||0.8); Howler.volume(master); }
}
