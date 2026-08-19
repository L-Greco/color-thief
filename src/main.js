const player = new Player();
const enemy = new Player();
const game = new Game(player, enemy);
renderedCards = cardConfigs.map(
  (card) =>
    new Card(card.x, card.y, card.width, card.height, card.name, card.cost),
);
drawCards = () => renderedCards.forEach((card) => card.draw());

let previousTimeStamp = 0;

function update(delta) {
  const deltaSeconds = delta / 1000;

  renderedCards.forEach((card) => {
    const isMouseOver = pointCollision(
      {
        x: card.x,
        y: card.y,
        width: card.width,
        height: card.height,
      },
      mousePosition,
    );

    card.setHover(isMouseOver);
    card.update(deltaSeconds);
  });
}

function pointCollision(rect, point) {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
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
  drawBoard();
  drawCards();

  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
