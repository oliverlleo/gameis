export class InputSystem {
  constructor(scene){ this.scene=scene; }
  init(){
    this.keys = this.scene.input.keyboard.addKeys({ left:'A', right:'D', jump:'SPACE', light:'J', heavy:'K', s1:'ONE', s2:'TWO', s3:'THREE', s4:'FOUR', s5:'FIVE', pause:'ESC' });
    this.scene.input.keyboard.on('keydown-ESC', ()=> this.scene.systemsMap.ui.togglePause());
  }
  update(){
    const p = this.scene.player;
    if (Phaser.Input.Keyboard.JustDown(this.keys.jump)) p.lastJumpPressAt = performance.now();
  }
}
