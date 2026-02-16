export default class InputSystem {
  constructor(scene) {
    this.scene = scene;
    this.bindings = {
      left: 'A',
      right: 'D',
      jump: 'SPACE',
      down: 'S',
      light: 'J',
      heavy: 'K',
      skill1: 'Q',
      skill2: 'W',
      skill3: 'E',
      skill4: 'R',
      skill5: 'F',
      pause: 'ESC',
      debug: 'F3'
    };
    this.keys = {};
  }

  init(savedBindings = null) {
    if (savedBindings) this.bindings = { ...this.bindings, ...savedBindings };
    for (const [action, code] of Object.entries(this.bindings)) {
      this.keys[action] = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[code]);
    }
  }

  setBinding(action, code) {
    if (!this.bindings[action]) return false;
    const upper = String(code).toUpperCase();
    if (!Phaser.Input.Keyboard.KeyCodes[upper]) return false;
    this.bindings[action] = upper;
    this.keys[action] = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[upper]);
    return true;
  }

  getAxisX() {
    const l = this.keys.left.isDown ? -1 : 0;
    const r = this.keys.right.isDown ? 1 : 0;
    return l + r;
  }

  pressed(action) {
    return Phaser.Input.Keyboard.JustDown(this.keys[action]);
  }

  down(action) {
    return !!this.keys[action]?.isDown;
  }

  released(action) {
    return Phaser.Input.Keyboard.JustUp(this.keys[action]);
  }

  getSnapshot() {
    return { ...this.bindings };
  }
}
