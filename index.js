// Constants
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const BLOCK_SIZE = 20;
const NUM_BLOCKS = CANVAS_WIDTH / BLOCK_SIZE;
const FPS = 10;

// Variables
let canvas, ctx;
let snake, food;
let direction = "right";
let score = 0;

// Snake class
class Snake {
  constructor() {
    this.body = [
      { x: 3, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 0 }
    ];
  }

  draw() {
    for (let i = 0; i < this.body.length; i++) {
      ctx.fillStyle = "green";
      ctx.fillRect(
        this.body[i].x * BLOCK_SIZE,
        this.body[i].y * BLOCK_SIZE,
        BLOCK_SIZE,
        BLOCK_SIZE
      );
    }
  }

  update() {
    let head = { x: this.body[0].x, y: this.body[0].y };
    switch (direction) {
      case "right":
        head.x++;
        break;
      case "left":
        head.x--;
        break;
      case "up":
        head.y--;
        break;
      case "down":
        head.y++;
        break;
    }

    this.body.pop();
    this.body.unshift(head);
  }

  grow() {
    let tail = { x: this.body[this.body.length - 1].x, y: this.body[this.body.length - 1].y };
    this.body.push(tail);
  }

  checkCollision() {
    let head = this.body[0];
    if (head.x < 0 || head.x >= NUM_BLOCKS || head.y < 0 || head.y >= NUM_BLOCKS) {
      return true;
    }

    for (let i = 1; i < this.body.length; i++) {
      if (head.x == this.body[i].x && head.y == this.body[i].y) {
        return true;
      }
    }

    return false;
  }

  eat(food) {
    if (this.body[0].x == food.x && this.body[0].y == food.y) {
      this.grow();
      score++;
      return true;
    }

    return false;
  }
}

// Food class
class Food {
  constructor() {
    this.x = Math.floor(Math.random() * NUM_BLOCKS);
    this.y = Math.floor(Math.random() * NUM_BLOCKS);
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(
      this.x * BLOCK_SIZE,
      this.y * BLOCK_SIZE,
      BLOCK_SIZE,
      BLOCK_SIZE
    );
  }
}

// Initialize game
function init() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  snake = new Snake();
  food = new Food();

  document.addEventListener("keydown", handleKeyPress);
  setInterval(gameLoop, 1000 / FPS);
}

// Main game loop
function gameLoop() {
  snake.update();
  if (snake.checkCollision()) {
    alert("Game over! Your score was " + score);
    location.reload();
  }

  if (snake.eat(food)) {
    food = new Food();
  }

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  snake.draw();
  food.draw();
}