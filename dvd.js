class DVD {
	constructor(speed, canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext("2d");

		this.direction = Math.random() * 2 * Math.PI;

		this.speed = speed;
		this.x_speed = Math.cos(this.direction) * speed;
		this.y_speed = Math.sin(this.direction) * speed;

		this.x = Math.random() * this.canvas.width - 100;
		this.y = Math.random() * this.canvas.height - 100;
	}

	draw() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.fillRect(this.x, this.y, 100, 100);
	}

	update_position() {
		this.x += this.x_speed;
		this.y += this.y_speed;
	}
}

function loop() {
	window.requestAnimationFrame(loop);
	dvd.update_position();
	dvd.draw();
}

var dvd = new DVD(5, document.getElementById("dvdCanvas"));
loop();