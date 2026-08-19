const player = new Player("Player");
const enemy = new Player("Enemy");
const game = new Game(player, enemy);
game.startBattle();

let previousTimeStamp = 0;

function update(delta) {
  game.update(delta);

  if (game.activeScreen) {
    game.activeScreen.update(delta);
  }
}

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

  update(normalizeDelta(delta));
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (game.activeScreen) {
    game.activeScreen.draw();
  }

  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
