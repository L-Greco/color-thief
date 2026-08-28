const player = new Player();
const enemy = new Enemy();
const game = new Game(player, enemy);
game.startIntro();

let previousTimeStamp = 0;

function normalizeDelta(delta) {
  if (delta < 0) return 0;
  if (delta > MAX_DELTA) return MAX_DELTA;
  return delta;
}

function gameLoop(timestamp) {
  let delta = 0;

  if (previousTimeStamp !== 0) {
    delta = timestamp - previousTimeStamp;
  }
  previousTimeStamp = timestamp;

  game.update(normalizeDelta(delta));
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  game.draw();

  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
