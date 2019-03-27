class Entity {
    constructor(canvas_name, speed, direction, x, y, radius, colour) {
        this.canvas = document.getElementById(canvas_name);
        this.context = this.canvas.getContext("2d");

        this.speed = speed;
        this.update_bearing(direction);

        this.x = x;
        this.y = y;
        this.radius = radius;

        this.colour = colour;
    }

    draw_frame() {
        this.update_position();
        this.context.beginPath();
        this.context.fillStyle = this.colour;
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

class Enemy extends Entity {
    constructor(canvas_name) {
        // GREEN SPAWNS MOST OFTEN - FIX
        let colours = ["red", "green", "blue"];

        super(
            canvas_name,
            Math.random() * 4 + 2,
            Math.random() * 2 * Math.PI,
            Math.random() * 700 + 20,
            Math.random() * 500 + 20,
            20,
            colours[Math.floor(Math.random() * 2.99)]
        );
    }

    update_position() {
        if (this.x - this.radius < 0 || this.x + this.radius > this.canvas.width) {
            this.x -= this.x_speed;
            this.update_bearing(Math.PI - this.direction);
        } else if (this.y - this.radius < 0 || this.y + this.radius > this.canvas.height) {
            this.y += this.y_speed;
            this.update_bearing(this.direction - (this.direction * 2));
        }
        super.update_position();
    }
}


class Player extends Entity {
    constructor(canvas_name) {
        super(canvas_name, 10, 0, 400, 300, 30, "red");

        this.pressed = new Map;
        this.pressed.set("w", false)
        this.pressed.set("a", false)
        this.pressed.set("s", false)
        this.pressed.set("d", false)

        this.keys_pressed = 0;
        this.points = 0;

        window.addEventListener('keydown', this.key_down.bind(this));
        window.addEventListener('keyup', this.key_up.bind(this));
    }

    add_point() {
        this.points += 1;
        this.radius += this.points * 3;
        if(this.x + this.radius > this.canvas.width) this.x -= this.radius;
        if(this.x - this.radius < 0) this.x += this.radius;
        if(this.y + this.radius > this.canvas.height) this.y -= this.radius;
        if(this.y - this.radius < 0) this.y += this.radius;
    }

    remove_point() {
        if(this.points > 0) {
            this.points -= 1;
            this.radius -= this.points * 3;
        }
    }

    update_position() {
        if( !this.pressed.get("w") &&
            !this.pressed.get("a") &&
            !this.pressed.get("s") &&
            !this.pressed.get("d")
        ) return;

        if(this.pressed.get("w")) this.direction += Math.PI / 2;
        if(this.pressed.get("a")) this.direction += Math.PI;
        if(this.pressed.get("s")) this.direction += 3 / 2 * Math.PI;
        if(this.pressed.get("d")) this.pressed.get("w") ? this.direction += 0 : this.direction += 2 * Math.PI;

        this.direction /= this.keys_pressed;

        if(this.x + this.radius > this.canvas.width || this.x - this.radius < 0)
            this.x -= this.x_speed;

        if(this.y + this.radius > this.canvas.height || this.y - this.radius < 0)
            this.y += this.y_speed;

        this.update_bearing(this.direction);
        super.update_position();

        this.direction = 0;
    }

    draw_frame() {
        super.draw_frame();
        this.context.font = "30px Arial";
        this.context.fillStyle = "white";
        this.context.textAlign = "center";
        this.context.fillText(this.points, this.x, this.y + 10);
    }

    key_down(event) {
        if(event.key == "j") this.colour = "red";
        else if (event.key == "k") this.colour = "green";
        else if (event.key == "l") this.colour = "blue";

        if(!Array.from(this.pressed.keys()).includes(event.key)) return;
        if(this.pressed.get(event.key)) return;

        this.pressed.set(event.key, true);
        this.keys_pressed++;
    }

    key_up(event) {
        if(!Array.from(this.pressed.keys()).includes(event.key)) return;
        this.pressed.set(event.key, false);
        this.keys_pressed--;
    }
}

class GameManager {
    constructor(canvas_name, player) {
        this.canvas = document.getElementById(canvas_name);
        this.context = this.canvas.getContext("2d");

        this.enemies = [];
        for(let i = 0; i < 10; i++) this.enemies.push(new Enemy(canvas_name));
        this.player = player;
    }

    is_colliding(entity1, entity2) {
        let x_distance = entity1.x - entity2.x;
        let y_distance = entity1.y - entity2.y;

        let distance = Math.sqrt((x_distance*x_distance) + (y_distance*y_distance));

        let radii = entity1.radius + entity2.radius;

        return distance < radii;
    }

    run() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.enemies.forEach(function(enemy) {
            if(this.is_colliding(this.player, enemy)) {
                if(enemy.colour == this.player.colour) this.player.add_point();
                else this.player.remove_point();

                let index = this.enemies.indexOf(enemy);
                if (index !== -1) this.enemies.splice(index, 1);
            }

            enemy.draw_frame();
        }.bind(this));

        this.player.draw_frame();
    }
}

let player = new Player("collisionCanvas");
let gm = new GameManager("collisionCanvas", player);

function loop() {
    window.requestAnimationFrame(loop);
    gm.run();
}

loop();