export default class MovementSystem {
    constructor(scene) {
        this.scene = scene;
    }

    moveTowards(body, targetX, speed) {
        if (!body) return;
        
        if (body.x < targetX - 10) { // Deadzone
            body.setVelocityX(speed);
            if (body.gameObject) body.gameObject.setFlipX(false); // Face Right
        } else if (body.x > targetX + 10) {
            body.setVelocityX(-speed);
            if (body.gameObject) body.gameObject.setFlipX(true); // Face Left
        } else {
            body.setVelocityX(0);
        }
    }

    stop(body) {
        if (body) body.setVelocityX(0);
    }

    jump(body, force) {
        if (body && body.blocked.down) {
            body.setVelocityY(force);
        }
    }
}
