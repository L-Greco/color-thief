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

drawX = (x, y, scale = 1, color = "#000") => {
  const arm = 2 * scale;

  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5 * scale;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x - arm, y - arm);
  ctx.lineTo(x + arm, y + arm);
  ctx.moveTo(x + arm, y - arm);
  ctx.lineTo(x - arm, y + arm);
  ctx.stroke();
};

drawLightning = (x, y, scale = 1) => {
  const spX = 28;
  const spY = 65;
  const boltCenterX = 48;
  const boltCenterY = 32;

  ctx.save();
  ctx.translate(x - boltCenterX * scale, y - boltCenterY * scale);
  ctx.scale(scale, scale);

  const gradient = ctx.createRadialGradient(
    spX + 18, spY - 30, 1, spX + 18, spY - 30, 28,
  );
  gradient.addColorStop(0, "#fff");
  gradient.addColorStop(0.48, "#1af6fb");
  gradient.addColorStop(1, "#0260fb");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(spX + 3.31, spY - 14.63);
  ctx.quadraticCurveTo(spX + 15.19, spY - 17.58, spX + 27.41, spY - 34);
  ctx.lineTo(spX + 19.15, spY - 34.16);
  ctx.lineTo(spX + 36.65, spY - 51.07);
  ctx.quadraticCurveTo(spX + 24.1, spY - 47.79, spX + 8.43, spY - 31.04);
  ctx.lineTo(spX + 15.52, spY - 30.06);
  ctx.quadraticCurveTo(spX + 10.74, spY - 21.19, spX + 3.48, spY - 15.28);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#00adf7";
  ctx.fillRect(spX + 20.8, spY - 19.06, -1.65, -1.65);
  ctx.fillRect(spX + 4.47, spY - 26.78, -1.65, -1.65);
  ctx.fillRect(spX + 32.52, spY - 36.13, -1.65, -1.65);
  ctx.fillRect(spX + 18.16, spY - 47.63, -1.65, -1.65);

  drawX(spX + 28.4, spY - 24.64, 0.5, "#24f5f9");
  drawX(spX + 9.91, spY - 43.36, 0.5, "#24f5f9");
  ctx.restore();
};

drawStar = (x, y, scale = 1) => {
  const spX = 32;
  const spY = 48;
  const starScale = 1.4;
  const centerX = spX + 0.14;
  const centerY = spY - 0.18;
  const topY = spY - 18.57;
  const rightX = spX + 17.97;
  const bottomY = spY + 18.54;
  const leftX = spX - 18.17;

  ctx.save();
  ctx.translate(x - centerX * scale, y - centerY * scale);
  ctx.scale(scale, scale);
  ctx.translate(spX, spY);
  ctx.scale(starScale, starScale);
  ctx.translate(-spX, -spY);

  const gradient = ctx.createRadialGradient(
    centerX, centerY, 1, centerX, centerY, 26,
  );
  gradient.addColorStop(0, "#fff");
  gradient.addColorStop(0.5, "#fbe201");
  gradient.addColorStop(1, "#f58b04");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(centerX, topY);
  ctx.quadraticCurveTo(centerX, centerY, rightX, centerY);
  ctx.quadraticCurveTo(centerX, centerY, centerX, bottomY);
  ctx.quadraticCurveTo(centerX, centerY, leftX, centerY);
  ctx.quadraticCurveTo(centerX, centerY, centerX, topY);
  ctx.closePath();
  ctx.fill();

  drawX(spX + 11.23, spY + 12.97, 0.5, "#f58b04");
  drawX(spX - 11.38, spY + 12.97, 0.5, "#f58b04");
  drawX(spX + 11.06, spY - 13.3, 0.5, "#f58b04");
  drawX(spX - 11.38, spY - 13.3, 0.5, "#f58b04");

  ctx.fillStyle = "#f58b04";
  ctx.fillRect(spX + 13.54, spY + 6.24, -1.65, -1.65);
  ctx.fillRect(spX - 13.86, spY + 5.42, -1.65, -1.65);
  ctx.fillRect(spX - 14.19, spY - 6.57, -1.65, -1.65);
  ctx.fillRect(spX + 14.36, spY - 6.4, -1.65, -1.65);
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
