mousePosition = {
  x: 0,
  y: 0,
};

canvas.addEventListener("pointerdown", () => {
  ensureAudioReady();
});

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mousePosition.x = e.clientX - rect.left;
  mousePosition.y = e.clientY - rect.top;
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
