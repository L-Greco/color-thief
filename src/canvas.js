canvas = document.getElementById("game");
ctx = canvas.getContext("2d");
canvasBaseWidth = canvas.width;
canvasBaseHeight = canvas.height;

resizeCanvas = () => {
  const availableRatio = innerWidth / innerHeight;
  const canvasRatio = canvasBaseWidth / canvasBaseHeight;
  let appliedWidth = innerWidth;
  let appliedHeight = innerWidth / canvasRatio;

  if (availableRatio > canvasRatio) {
    appliedHeight = innerHeight;
    appliedWidth = appliedHeight * canvasRatio;
  }

  canvas.style.width = `${appliedWidth}px`;
  canvas.style.height = `${appliedHeight}px`;
};

getCanvasPoint = (clientX, clientY) => {
  const rect = canvas.getBoundingClientRect();

  return {
    x: ((clientX - rect.left) / rect.width) * canvas.width,
    y: ((clientY - rect.top) / rect.height) * canvas.height,
  };
};

ctx.wrap = (callback) => {
  ctx.save();
  callback();
  ctx.restore();
};

drawZoneBorder = (zone, label, textY) => {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.font = "24px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeRect(...zone);
  ctx.fillText(label, 200, textY);
};

drawBattleDebugBorders = () => {
  drawZoneBorder(BATTLE_LAYOUT.enemyStatus, "enemy status", 30);
  drawZoneBorder(BATTLE_LAYOUT.enemyBoard, "enemy board", 100);
  drawZoneBorder(BATTLE_LAYOUT.playerBoard, "player board", 345);
  drawZoneBorder(BATTLE_LAYOUT.playerHand, "player hand", 550);
  drawZoneBorder(BATTLE_LAYOUT.playerStatus, "player status", 690);
};

addEventListener("resize", resizeCanvas);
resizeCanvas();
