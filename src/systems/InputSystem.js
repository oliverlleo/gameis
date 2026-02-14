export default class InputSystem {
    constructor(scene) {
        this.scene = scene;
        this.cursors = scene.input.keyboard.createCursorKeys();

        // Custom keys
        this.keys = scene.input.keyboard.addKeys({
            w: Phaser.Input.Keyboard.KeyCodes.W,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            s: Phaser.Input.Keyboard.KeyCodes.S,
            d: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            jump: Phaser.Input.Keyboard.KeyCodes.Z, // Alternative Jump
            attack: Phaser.Input.Keyboard.KeyCodes.X, // Attack
            dash: Phaser.Input.Keyboard.KeyCodes.C, // Dash / Skill 2
            skill1: Phaser.Input.Keyboard.KeyCodes.ONE,
            skill2: Phaser.Input.Keyboard.KeyCodes.TWO,
            skill3: Phaser.Input.Keyboard.KeyCodes.THREE,
            skill4: Phaser.Input.Keyboard.KeyCodes.FOUR,
            skill5: Phaser.Input.Keyboard.KeyCodes.FIVE,
            interact: Phaser.Input.Keyboard.KeyCodes.E,
            pause: Phaser.Input.Keyboard.KeyCodes.ESC
        });

        // Jump buffering state
        this.jumpBufferTimer = 0;
    }

    update(time, delta) {
        // Handle jump buffer
        if (Phaser.Input.Keyboard.JustDown(this.keys.space) || Phaser.Input.Keyboard.JustDown(this.keys.jump) || Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.keys.w)) {
            this.jumpBufferTimer = 150; // slightly more than physics buffer for safety
        }
        if (this.jumpBufferTimer > 0) {
            this.jumpBufferTimer -= delta;
        }
    }

    getInputs() {
        const left = this.cursors.left.isDown || this.keys.a.isDown;
        const right = this.cursors.right.isDown || this.keys.d.isDown;
        const up = this.cursors.up.isDown || this.keys.w.isDown;
        const down = this.cursors.down.isDown || this.keys.s.isDown;

        const jumpPressed = Phaser.Input.Keyboard.JustDown(this.keys.space) || Phaser.Input.Keyboard.JustDown(this.keys.jump) || Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.keys.w);
        const jumpHeld = this.keys.space.isDown || this.keys.jump.isDown || this.cursors.up.isDown || this.keys.w.isDown;

        return {
            x: (right ? 1 : 0) - (left ? 1 : 0),
            y: (down ? 1 : 0) - (up ? 1 : 0),
            jumpPressed: jumpPressed,
            jumpHeld: jumpHeld,
            jumpBuffered: this.jumpBufferTimer > 0,
            attack: Phaser.Input.Keyboard.JustDown(this.keys.attack),
            dash: Phaser.Input.Keyboard.JustDown(this.keys.dash),
            skill1: Phaser.Input.Keyboard.JustDown(this.keys.skill1),
            skill2: Phaser.Input.Keyboard.JustDown(this.keys.skill2),
            skill3: Phaser.Input.Keyboard.JustDown(this.keys.skill3),
            skill4: Phaser.Input.Keyboard.JustDown(this.keys.skill4),
            skill5: Phaser.Input.Keyboard.JustDown(this.keys.skill5),
            interact: Phaser.Input.Keyboard.JustDown(this.keys.interact),
            pause: Phaser.Input.Keyboard.JustDown(this.keys.pause)
        };
    }

    consumeJumpBuffer() {
        this.jumpBufferTimer = 0;
    }
}
