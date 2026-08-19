mousePosition = {
  x: 0,
  y: 0,
};

canvas.addEventListener("pointerdown", () => {
  ensureAudioReady();
});

canvas.addEventListener("pointerdown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const point = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };

  mousePosition.x = point.x;
  mousePosition.y = point.y;

  if (game.activeScreen) {
    game.activeScreen.handlePointerDown(point);
  }
});

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mousePosition.x = e.clientX - rect.left;
  mousePosition.y = e.clientY - rect.top;

  if (game.activeScreen) {
    game.activeScreen.handlePointerMove(mousePosition);
  }
});

canvas.addEventListener("pointerup", (e) => {
  const rect = canvas.getBoundingClientRect();
  const point = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };

  mousePosition.x = point.x;
  mousePosition.y = point.y;

  if (game.activeScreen && game.activeScreen.handlePointerUp(point)) {
    return;
  }
});

canvas.addEventListener("click", () => {
  if (game.activeScreen && game.activeScreen.handleClick(mousePosition)) {
    return;
  }
});

document.addEventListener("keydown", (e) => {
  ensureAudioReady();

  if (e.code === "KeyD") {
    game.drawCardForPlayer();
  }

  if (e.code === "KeyE") {
    game.drawCardForEnemy();
  }
});
