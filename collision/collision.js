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
        super(canvas, 5, 0, 400, 300, 20);

        this.keys_pressed = 0;

        this.allowed = ["w", "a", "s", "d"];

        this.pressed = {};
        this.pressed["w"] = false;
        this.pressed["a"] = false;
        this.pressed["s"] = false;
        this.pressed["d"] = false;

        window.addEventListener('keydown', this.key_down.bind(this));
        window.addEventListener('keyup', this.key_up.bind(this));
    }

    update_position() {
        if(
            !this.pressed["w"] &&
            !this.pressed["a"] &&
            !this.pressed["s"] &&
            !this.pressed["d"]
        ) { return };
        this.update_bearing(this.direction);
        super.update_position();
    }

    key_down(event) {
        if(!this.allowed.includes(event.key)) { return };
        if(this.pressed[event.key]) { return };

        switch(event.key) {
            case "w": this.direction += Math.PI / 2;        break;
            case "a": this.direction += Math.PI;            break;
            case "s": this.direction += 3 / 2 * Math.PI;    break;
            case "d": this.pressed["w"] ? this.direction += 0 : this.direction += 2 * Math.PI;
        };

        this.pressed[event.key] = true;

        this.keys_pressed++;
        this.direction /= this.keys_pressed;

        console.log(`KEY_DOWN: Pressed: ${this.keys_pressed}, Direction: ${this.direction}`);
        console.log(`x_speed: ${this.x_speed}`);
        console.log(`y_speed: ${this.y_speed}`);
    }

    key_up(event) {
        if(!this.allowed.includes(event.key)) { return };

        this.direction *= this.keys_pressed;
        this.keys_pressed--;

        switch(event.key) {
            case "w": this.direction -= Math.PI / 2;        break;
            case "a": this.direction -= Math.PI;            break;
            case "s": this.direction -= (3 / 2) * Math.PI;  break;
            case "d": this.pressed["w"] ? this.direction -= 0 : this.direction -= 2 * Math.PI;
        };

        this.pressed[event.key] = false;
    }
}

let player = new Player(document.getElementById("collisionCanvas"));
function loop() {
    window.requestAnimationFrame(loop);
    player.draw_frame();
}

loop();