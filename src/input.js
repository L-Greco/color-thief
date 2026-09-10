mousePosition = {
  x: 0,
  y: 0,
};

canvas.addEventListener("pointerdown", (e) => {
  ensureAudioReady();
  const point = getCanvasPoint(e.clientX, e.clientY);

  mousePosition.x = point.x;
  mousePosition.y = point.y;

  if (game.handlePointerDown(point)) {
    return;
  }

  game.screen?.handlePointerDown?.(point);
});

canvas.addEventListener("mousemove", (e) => {
  const point = getCanvasPoint(e.clientX, e.clientY);
  mousePosition.x = point.x;
  mousePosition.y = point.y;

  if (game.handlePointerMove(point)) {
    return;
  }

  game.screen?.handlePointerMove?.(mousePosition);
});

canvas.addEventListener("pointerup", (e) => {
  const point = getCanvasPoint(e.clientX, e.clientY);

  mousePosition.x = point.x;
  mousePosition.y = point.y;

  if (game.handlePointerUp(point)) {
    return;
  }

  if (game.screen?.handlePointerUp?.(point)) {
    return;
  }
});

canvas.addEventListener("click", () => {
  if (game.handleClick(mousePosition)) {
    return;
  }

  if (game.screen?.handleClick?.(mousePosition)) {
    return;
  }
});

document.addEventListener("keydown", (e) => {
  ensureAudioReady();

  if (game.handleKeyDown(e)) {
    e.preventDefault();
    return;
  }

  if (game.screen?.handleKeyDown?.(e)) {
    e.preventDefault();
  }
});
