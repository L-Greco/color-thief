keyMapping = {
  KeyW: "moveUp",
  KeyS: "moveDown",
  KeyA: "moveLeft",
  KeyD: "moveRight",
  ArrowUp: "moveUp",
  ArrowDown: "moveDown",
  ArrowLeft: "moveLeft",
  ArrowRight: "moveRight",
};

actions = {
  moveUp: false,
  moveDown: false,
  moveLeft: false,
  moveRight: false,
};
mousePosition = {
  x: 0,
  y: 0,
};
audio = new Audio();
document.addEventListener("keydown", (e) => {
  if (e.code in keyMapping) {
    e.preventDefault();
    const action = keyMapping[e.code];
    actions[action] = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code in keyMapping) {
    const action = keyMapping[e.code];
    e.preventDefault();
    actions[action] = false;
  }
});

canvas.addEventListener("mousemove", (e) => {
  // Get the mouse position relative to the canvas
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  mousePosition.x = mouseX;
  mousePosition.y = mouseY;
});

canvas.addEventListener("click", () => {
  // audio.play();
  zzfx(...CARD_DRAW_SOUND);
});
function resetActions() {
  Object.keys(actions).forEach((key) => (actions[key] = false));
}

window.addEventListener("blur", resetActions);
