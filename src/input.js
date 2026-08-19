mousePosition = {
  x: 0,
  y: 0,
};

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mousePosition.x = e.clientX - rect.left;
  mousePosition.y = e.clientY - rect.top;
});

canvas.addEventListener("click", () => {
  zzfx(...CARD_DRAW_SOUND);
});
