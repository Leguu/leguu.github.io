class DigitalVersatileDisc {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");

        this.direction = Math.random() * (2 * Math.PI);
        this.speed = 3;
        this.update_speed();

        this.image = new Image;
        this.image.src = "https://upload.wikimedia.org/wikipedia/en/1/18/Dvd-video-logo.svg";

        this.x_size = 100;
        this.y_size = 100;

        this.x = Math.random() * (this.canvas.width - this.x_size);
        this.y = Math.random() * (this.canvas.height - this.y_size);
    }

    run() {
        this.context.clearRect(this.x, this.y, this.x_size, this.y_size);
        this.update_position();
        this.context.drawImage(this.image, this.x, this.y, this.x_size, this.y_size);
    }

    update_position() {
        if (this.x < 0 || this.x + this.x_size > this.canvas.width) {
            this.x -= this.x_speed;
            this.direction = Math.PI - this.direction;
            this.update_speed();
        } else if (this.y < 0 || this.y + this.y_size > this.canvas.height) {
            this.y -= this.y_speed;
            this.direction -= this.direction * 2;
            this.update_speed();
        }
        this.x += this.x_speed;
        this.y += this.y_speed;
    }

    update_speed() {
        this.x_speed = Math.cos(this.direction) * this.speed;
        this.y_speed = Math.sin(this.direction) * this.speed;
    }
}

var dvd = new DigitalVersatileDisc(document.getElementById("dvdCanvas"));
function loop() {
    window.requestAnimationFrame(loop);
    dvd.run();
}

loop();