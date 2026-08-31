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

  if (game.handlePointerDown(point)) {
    return;
  }

  if (game.screen) {
    game.screen.handlePointerDown(point);
  }
});

canvas.addEventListener("mousemove", (e) => {
  const point = getCanvasPoint(e.clientX, e.clientY);
  mousePosition.x = point.x;
  mousePosition.y = point.y;

  if (game.handlePointerMove(point)) {
    return;
  }

  if (game.screen) {
    game.screen.handlePointerMove(mousePosition);
  }
});

canvas.addEventListener("pointerup", (e) => {
  const point = getCanvasPoint(e.clientX, e.clientY);

  mousePosition.x = point.x;
  mousePosition.y = point.y;

  if (game.handlePointerUp(point)) {
    return;
  }

  if (game.screen && game.screen.handlePointerUp(point)) {
    return;
  }
});

canvas.addEventListener("click", () => {
  if (game.handleClick(mousePosition)) {
    return;
  }

  if (game.screen && game.screen.handleClick(mousePosition)) {
    return;
  }
});

document.addEventListener("keydown", (e) => {
  ensureAudioReady();

  if (game.handleKeyDown(e)) {
    e.preventDefault();
    return;
  }

  if (game.screen && game.screen.handleKeyDown && game.screen.handleKeyDown(e)) {
    e.preventDefault();
    return;
  }

  if (
    typeof debugConfig !== "undefined" &&
    debugConfig.allowManualDeckDraw &&
    e.code === "KeyD" &&
    game.battle
  ) {
    game.battle.drawCardForPlayer();
  }

  if (
    typeof debugConfig !== "undefined" &&
    debugConfig.allowManualDeckDraw &&
    e.code === "KeyE" &&
    game.battle
  ) {
    game.battle.drawCardForEnemy();
  }
});
