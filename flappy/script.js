// This has to be at the top, because Javascript doesn't have easy imports
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(other) {
    return new Point(this.x + other.x, this.y + other.y);
  }

  sub(other) {
    return new Point(this.x - other.x, this.y - other.y);
  }

  mult(other) {
    return new Point(this.x * other.x, this.y * other.y);
  }
}

const gravity = 0.3;
const pipeWidth = 50;
// How far should Bird go before the camera follows it?
const followDistance = 200;
const jumpDistance = new Point(0.7, -9);
const birdSize = 50;

const minPipeDistance = 220;
const minHoleSize = 100;

const State = Object.freeze({
  ON: 0,
  OFF: 1,
  DEAD: 2,
});

const PipeDirection = Object.freeze({
  DOWN: 1,
  UP: -1,
});

// Speed limit
const limit = new Point(7, 15);
// How much friction is there? Must be VERY close to 1 in order for physics to work
const drag = new Point(0.995, 0.99);

// Taken from stackoverflow <https://stackoverflow.com/questions/21089959/detecting-collision-of-rectangle-with-circle>
// God help me if I use an actual bird sprite
function intersect(circle, rect) {
  var distX = Math.abs(circle.pos.x - rect.pos.x - pipeWidth / 2);
  var distY = Math.abs(circle.pos.y - rect.pos.y - rect.size / 2);

  if (distX > pipeWidth / 2 + birdSize / 2) return false;

  if (distY > rect.size / 2 + birdSize / 2) return false;

  if (distX <= pipeWidth / 2) return true;

  if (distY <= rect.size / 2) return true;

  var dx = distX - pipeWidth / 2;
  var dy = distY - rect.size / 2;

  return dx * dx + dy * dy <= (birdSize / 2) * (birdSize / 2);
}

class Bird {
  constructor() {
    this.pos = new Point(50, height / 2);
    this.pre = new Point(this.pos.x, this.pos.y);
  }

  // With the power of verlet integration, physics happens automatically!
  update() {
    let velocity = this.pos.sub(this.pre);
    velocity.y += gravity;

    velocity = velocity.mult(drag);

    if (velocity.x > limit.x) velocity.x = limit.x;
    if (velocity.y > limit.y) velocity.y = limit.y;

    this.pre = new Point(this.pos.x, this.pos.y);

    this.pos = this.pos.add(velocity);
  }

  draw(x, y) {
    circle(x, y, birdSize);
  }
}

class Pipe {
  constructor(x, facing, size) {
    this.pos = new Point(x, facing === PipeDirection.DOWN ? 0 : height - size);
    this.facing = facing;
    this.size = size;
  }

  draw(x, y) {
    rect(x, this.pos.y, pipeWidth, this.size);
  }

  static generate(after) {
    const next = after + minPipeDistance + Math.random() * 200;

    const currentHole = minHoleSize + Math.random() * 100;

    const remainingHeight = height - currentHole;

    const upperSize = Math.random() * remainingHeight;

    const upper = new Pipe(next, PipeDirection.DOWN, upperSize);
    const lower = new Pipe(next, PipeDirection.UP, remainingHeight - upperSize);

    return [upper, lower, next];
  }
}

class Camera {
  constructor() {
    this.pos = new Point(0, 0);
  }

  follow(entity) {
    if (entity.pos.x > followDistance)
      this.pos.x = entity.pos.x - followDistance;
  }

  draw(entity) {
    entity.draw(entity.pos.x - this.pos.x, entity.pos.y - this.pos.y);
  }
}

function reset() {
  state = State.ON;
  bird = new Bird();
  cam = new Camera();
}

function setup() {
  createCanvas(1000, 600);

  bird = new Bird();
  cam = new Camera();

  pipes = [];
  let previous = 100;
  for (let i = 0; i < 100; i++) {
    const [upper, lower, position] = Pipe.generate(previous);
    pipes.push(upper);
    pipes.push(lower);
    previous = position + pipeWidth;
  }

  state = State.OFF;
}

function draw() {
  clear();

  pipes.forEach((pipe) => {
    // Don't waste CPU by drawing stuff outside the screen
    if (pipe.pos.x > cam.pos.x + width || pipe.pos.x + pipeWidth < cam.pos.x)
      return;
    cam.draw(pipe);
  });
  cam.draw(bird);

  if (state === State.OFF) return;

  bird.update();

  // If we're dead, we don't want any of the rest of this stuff
  if (state === State.DEAD) return;

  cam.follow(bird);

  const fail =
    bird.pos.y + birdSize / 2 > height ||
    bird.pos.y - birdSize / 2 < 0 ||
    pipes.some((pipe) => intersect(bird, pipe));

  // Luckily our intersect method is pretty efficient
  if (fail) {
    // Stop the bird dead in its tracks and add a cute bounce
    bird.pre.x = bird.pos.x;
    bird.pos = bird.pos.add(jumpDistance);
    state = State.DEAD;
  }
}

function keyPressed() {
  // Just spacebar
  if (keyCode !== 32) return;
  
  if (state === State.OFF) state = State.ON;

  if (state === State.DEAD && bird.pos.y > height) reset();

  if (state === State.DEAD) return;

  bird.pos = bird.pos.add(jumpDistance);
}

function touchStarted() {
  if (state === State.OFF) state = State.ON;

  if (state === State.DEAD && bird.pos.y > height) reset();

  if (state === State.DEAD) return;

  bird.pos = bird.pos.add(jumpDistance);
}
