class Entity {
    constructor(canvas, speed, direction, x, y, radius) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");

        this.speed = speed;
        this.update_bearing(direction);

        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    draw_frame() {
        this.context.clearRect(
            (this.x - this.radius) - 1,
            (this.y - this.radius) - 1,
            (this.radius * 2) + 2,
            (this.radius * 2) + 2
        );

        this.update_position();

        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.context.fill();
    }

    update_position() {
        this.x += this.x_speed;
        this.y -= this.y_speed;
    }

    update_bearing(direction) {
        this.direction = direction;
        this.x_speed = Math.cos(direction) * this.speed;
        this.y_speed = Math.sin(direction) * this.speed;
    }
}


class Player extends Entity {
    constructor(canvas) {
        super(canvas, 15, 0, 400, 300, 20);

        this.pressed = new Map;
        this.pressed.set("w", false)
        this.pressed.set("a", false)
        this.pressed.set("s", false)
        this.pressed.set("d", false)

        this.keys_pressed = 0;

        window.addEventListener('keydown', this.key_down.bind(this));
        window.addEventListener('keyup', this.key_up.bind(this));
    }

    update_position() {
        if( !this.pressed.get("w") &&
            !this.pressed.get("a") &&
            !this.pressed.get("s") &&
            !this.pressed.get("d")
        ) { return };

        if(this.pressed.get("w")) { this.direction += Math.PI / 2 };
        if(this.pressed.get("a")) { this.direction += Math.PI };
        if(this.pressed.get("s")) { this.direction += 3 / 2 * Math.PI };
        if(this.pressed.get("d")) { this.pressed.get("w") ? this.direction += 0 : this.direction += 2 * Math.PI };
        this.direction /= this.keys_pressed;

        if(this.x + this.radius > this.canvas.width || this.x - this.radius < 0) {
            this.x -= this.x_speed;
        }

        if(this.y + this.radius > this.canvas.height || this.y - this.radius < 0) {
            this.y += this.y_speed;
        }

        this.update_bearing(this.direction);
        super.update_position();

        this.direction = 0;
    }

    key_down(event) {
        if(!Array.from(this.pressed.keys()).includes(event.key)) { return };
        if(this.pressed.get(event.key)) { return };

        this.pressed.set(event.key, true);
        this.keys_pressed++;
    }

    key_up(event) {
        if(!Array.from(this.pressed.keys()).includes(event.key)) { return };
        this.pressed.set(event.key, false);
        this.keys_pressed--;
    }
}

let player = new Player(document.getElementById("collisionCanvas"));
function loop() {
    window.requestAnimationFrame(loop);
    player.draw_frame();
}

loop();