class DVD {
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

	draw_frame() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.drawImage(this.image, this.x, this.y, this.x_size, this.y_size);
	}

	update_position() {
		this.x += this.x_speed;
		this.y += this.y_speed;

		if (this.x_out_of_bounds()) {
			this.direction = Math.PI - this.direction;
		} else if (this.y_out_of_bounds()) {
			this.direction -= this.direction * 2;
		}

		this.update_speed();
	}

	x_out_of_bounds() {
		return this.x < 0 || this.x + this.x_size > this.canvas.width;
	}

	y_out_of_bounds() {
		return this.y < 0 || this.y + this.y_size > this.canvas.height;
	}

	update_speed() {
		this.x_speed = Math.cos(this.direction) * this.speed;
		this.y_speed = Math.sin(this.direction) * this.speed;
	}
}

function loop() {
	window.requestAnimationFrame(loop);
	dvd.update_position();
	dvd.draw_frame();
}

var dvd = new DVD(document.getElementById("dvdCanvas"));
loop();