mousePosition = {
  x: 0,
  y: 0,
};

canvas.addEventListener("pointerdown", () => {
  ensureAudioReady();
});

canvas.addEventListener("pointerdown", (e) => {
  const point = getCanvasPoint(e.clientX, e.clientY);

  mousePosition.x = point.x;
  mousePosition.y = point.y;

  if (game.screen) {
    game.screen.handlePointerDown(point);
  }
});

canvas.addEventListener("mousemove", (e) => {
  const point = getCanvasPoint(e.clientX, e.clientY);
  mousePosition.x = point.x;
  mousePosition.y = point.y;

  if (game.screen) {
    game.screen.handlePointerMove(mousePosition);
  }
});

canvas.addEventListener("pointerup", (e) => {
  const point = getCanvasPoint(e.clientX, e.clientY);

  mousePosition.x = point.x;
  mousePosition.y = point.y;

  if (game.screen && game.screen.handlePointerUp(point)) {
    return;
  }
});

canvas.addEventListener("click", () => {
  if (game.screen && game.screen.handleClick(mousePosition)) {
    return;
  }
});

document.addEventListener("keydown", (e) => {
  ensureAudioReady();

  if (e.code === "KeyD" && game.battle) {
    game.battle.drawCardForPlayer();
  }

  if (e.code === "KeyE" && game.battle) {
    game.battle.drawCardForEnemy();
  }
});
