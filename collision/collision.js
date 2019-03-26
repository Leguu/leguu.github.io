class Player {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");

        this.speed = 5;
        this.update_bearing(0);

        this.x_size = this.y_size = 100;
        this.x = Math.random() * (canvas.width - this.x_size);
        this.y = Math.random() * (canvas.height - this.y_size);
    }

    draw_frame() {
        this.context.clearRect(this.x, this.y, this.x_size, this.y_size);
        this.context.fillRect(this.x, this.y, this.x_size, this.y_size);
    }

    update_bearing(direction) {
        this.direction = direction;
        this.x_speed = Math.cos(direction) * this.speed;
        this.y_speed = Math.sin(direction) * this.speed;
    }
}