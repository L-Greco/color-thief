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

createStarfield = (count = 180) => {
  const stars = [];

  for (let index = 0; index < count; index += 1) {
    const speed = 8 + Math.random() * 24;
    const direction = Math.random() * PI * 2;

    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: 0.4 + Math.random() * 1.6,
      xVelocity: cos(direction) * speed,
      yVelocity: sin(direction) * speed,
    });
  }

  return stars;
};

updateStarfield = (stars, delta) => {
  const elapsedSeconds = delta / 1000;

  stars.forEach((star) => {
    star.x = (star.x + star.xVelocity * elapsedSeconds + canvas.width) % canvas.width;
    star.y = (star.y + star.yVelocity * elapsedSeconds + canvas.height) % canvas.height;
  });
};

drawStarfield = (stars, opacity = 1) => {
  stars.forEach((star) => {
    ctx.fillStyle = `rgba(255, 255, 255, ${(0.4 + star.radius / 3) * opacity})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, PI * 2);
    ctx.fill();
  });
};

drawStoryPlanet = (x, y, radius, greyProgress = 0) => {
  const halo = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius * 1.55);
  halo.addColorStop(0, `rgba(230, 241, 255, ${0.28 - greyProgress * 0.08})`);
  halo.addColorStop(1, "rgba(230, 241, 255, 0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(x, y, radius * 1.55, 0, PI * 2);
  ctx.fill();

  ctx.wrap(() => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, PI * 2);
    ctx.clip();

    const rainbow = ctx.createLinearGradient(x - radius, y - radius, x + radius, y + radius);
    rainbow.addColorStop(0, "#f85b9d");
    rainbow.addColorStop(0.22, "#f58b04");
    rainbow.addColorStop(0.4, "#fbe201");
    rainbow.addColorStop(0.58, "#1af6fb");
    rainbow.addColorStop(0.76, "#0260fb");
    rainbow.addColorStop(1, "#a500f7");
    ctx.fillStyle = rainbow;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);

    const grey = ctx.createRadialGradient(
      x - radius * 0.32,
      y - radius * 0.32,
      0,
      x - radius * 0.2,
      y - radius * 0.2,
      radius,
    );
    grey.addColorStop(0, "#d4d8dc");
    grey.addColorStop(0.55, "#7d848c");
    grey.addColorStop(1, "#252b34");
    ctx.globalAlpha = greyProgress;
    ctx.fillStyle = grey;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  });
};

drawColorThief = (x, y, scale, powerProgress = 0) => {
  const spX = 42;
  const spY = 29;

  ctx.wrap(() => {
    // This keeps the intro model aligned with the editor's reversed axes.
    ctx.translate(x + 64 * scale, y + 96 * scale);
    ctx.scale(-scale, -scale);

    drawColorThiefShape(spX, spY, "#7d848c");

    if (powerProgress > 0) {
      const gradient = ctx.createLinearGradient(
        spX - 35,
        spY + 28,
        spX + 25,
        spY - 21,
      );
      gradient.addColorStop(0, "#31114c");
      gradient.addColorStop(0.38, "#8c1cc7");
      gradient.addColorStop(0.68, "#fa5efb");
      gradient.addColorStop(1, "#4a126c");
      ctx.globalAlpha = powerProgress;
      drawColorThiefShape(spX, spY, gradient);
      ctx.globalAlpha = 1;
    }

    ctx.fillStyle = "#000";
    drawColorThiefEye(spX, spY, 1);
    drawColorThiefEye(spX, spY, -1);
  });
};

drawColorThiefShape = (spX, spY, color) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(spX, spY);
  ctx.quadraticCurveTo(spX + 5, spY + 25, spX - 15, spY + 28);
  ctx.quadraticCurveTo(spX - 35, spY + 25, spX - 30, spY);
  ctx.quadraticCurveTo(spX - 16, spY - 11, spX - 15, spY - 11);
  ctx.quadraticCurveTo(spX - 1, spY - 1, spX, spY - 1);
  ctx.closePath();
  ctx.fill();

  drawColorThiefCollar(spX, spY, 1, color);
  drawColorThiefCollar(spX, spY, -1, color);

  ctx.beginPath();
  ctx.moveTo(spX - 11, spY - 16);
  ctx.lineTo(spX - 15, spY - 12);
  ctx.lineTo(spX - 19, spY - 16);
  ctx.lineTo(spX - 15, spY - 19);
  ctx.closePath();
  ctx.fill();
};

drawColorThiefCollar = (spX, spY, direction, color) => {
  const collarAxisX = spX - 15;
  const collarGap = 4;
  const x = (distance) => collarAxisX + direction * (distance + collarGap / 2);

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x(1), spY - 12);
  ctx.lineTo(x(4), spY - 16);
  ctx.quadraticCurveTo(x(10), spY - 8, x(25), spY - 1);
  ctx.quadraticCurveTo(x(25), spY + 1, x(17), spY + 1);
  ctx.quadraticCurveTo(x(17), spY - 1, x(16), spY - 2);
  ctx.quadraticCurveTo(x(1), spY - 12, x(1), spY - 12);
  ctx.fill();
};

drawColorThiefEye = (spX, spY, direction) => {
  const eyeAxisX = spX - 15;
  const x = (distance) => eyeAxisX + direction * distance;

  ctx.beginPath();
  ctx.moveTo(x(12), spY + 11);
  ctx.lineTo(x(3), spY + 4);
  ctx.quadraticCurveTo(x(13), spY - 1, x(12), spY + 11);
  ctx.closePath();
  ctx.fill();
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
