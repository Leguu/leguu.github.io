class DigitalVersatileDisc {
  constructor(canvas_name) {
    this.canvas = document.getElementById(canvas_name);
    this.context = this.canvas.getContext("2d");

    this.speed = 3;
    this.update_speed(Math.random() * (2 * Math.PI));

    this.image = new Image();
    this.image.src =
      "https://upload.wikimedia.org/wikipedia/commons/9/9b/DVD_logo.svg";

    this.x_size = this.y_size = 100;
    this.x = Math.random() * (this.canvas.width - this.x_size);
    this.y = Math.random() * (this.canvas.height - this.y_size);
  }

  draw_frame() {
    this.context.clearRect(this.x, this.y, this.x_size, this.y_size);
    this.update_position();
    this.context.drawImage(
      this.image,
      this.x,
      this.y,
      this.x_size,
      this.y_size
    );
  }

  update_position() {
    if (this.x < 0 || this.x + this.x_size > this.canvas.width) {
      this.x -= this.x_speed;
      this.update_speed(Math.PI - this.direction);
    } else if (this.y < 0 || this.y + this.y_size > this.canvas.height) {
      this.y -= this.y_speed;
      this.update_speed(this.direction - this.direction * 2);
    }
    this.x += this.x_speed;
    this.y += this.y_speed;
  }

  update_speed(direction) {
    this.direction = direction;
    this.x_speed = Math.cos(direction) * this.speed;
    this.y_speed = Math.sin(direction) * this.speed;
  }
}

var dvd = new DigitalVersatileDisc("dvdCanvas");

function loop() {
  window.requestAnimationFrame(loop);
  dvd.draw_frame();
}

loop();
