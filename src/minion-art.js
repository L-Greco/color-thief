createMinionGradient = (spX, spY) => {
  const gradient = ctx.createLinearGradient(
    spX - 30,
    spY + 29,
    spX + 30,
    spY - 30,
  );
  gradient.addColorStop(0, "#ffffff");
  gradient.addColorStop(1, "#6e6e6e");
  return gradient;
};

drawMinionModel = (renderer, rect, options) => {
  const scale = Math.min(rect.width / 64, rect.height / 96);
  const width = 64 * scale;
  const height = 96 * scale;
  const x = rect.x + (rect.width - width) / 2;
  const y = rect.y + (rect.height - height) / 2;

  if (!options.transparentBackground) {
    ctx.fillStyle = "#000";
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
  }

  ctx.save();
  ctx.translate(x + width, y + height);
  ctx.scale(-scale, -scale);
  renderer.drawArt(options);
  ctx.restore();
};

class UnicornMinionArt {
  draw(rect, options = {}) {
    drawMinionModel(this, rect, options);
  }

  drawArt(options) {
    const spX = 25;
    const spY = 48;
    const unicornColor = options.unique
      ? this.createUniqueGradient(spX, spY)
      : createMinionGradient(spX, spY);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2.5;
    ctx.fillStyle = unicornColor;

    ctx.beginPath();
    ctx.moveTo(spX + 29, spY - 30);
    ctx.lineTo(spX + 30, spY - 8);
    ctx.quadraticCurveTo(spX + 18, spY + 5, spX + 3, spY + 13);
    ctx.bezierCurveTo(spX + 2, spY + 17, spX, spY + 18, spX - 5, spY + 20);
    ctx.quadraticCurveTo(spX - 4, spY + 16, spX - 4, spY + 12);
    ctx.quadraticCurveTo(spX - 8, spY + 9, spX - 11, spY + 6);
    ctx.bezierCurveTo(
      spX - 18,
      spY - 11,
      spX - 20,
      spY - 11,
      spX - 23,
      spY - 14,
    );
    ctx.quadraticCurveTo(spX - 22, spY - 19, spX - 15, spY - 20);
    ctx.quadraticCurveTo(spX - 13, spY - 19, spX - 11, spY - 15);
    ctx.quadraticCurveTo(spX - 1, spY - 17, spX + 5, spY - 4);
    ctx.lineTo(spX + 7, spY - 4);
    ctx.quadraticCurveTo(spX + 6, spY - 7, spX + 4, spY - 9);
    ctx.bezierCurveTo(spX + 17, spY - 15, spX + 3, spY - 19, spX + 9, spY - 30);
    ctx.lineTo(spX + 29, spY - 30);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = unicornColor;
    ctx.beginPath();
    ctx.moveTo(spX - 6, spY + 13);
    ctx.bezierCurveTo(spX - 8, spY + 12, spX - 11, spY + 9, spX - 12, spY + 9);
    ctx.lineTo(spX - 30, spY + 29);
    ctx.lineTo(spX - 6, spY + 13);
    ctx.closePath();
    this.paintAccent();

    this.drawWings(spX, spY, unicornColor);

    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(spX - 5, spY + 1, 2, 0, PI * 2);
    ctx.fill();
  }

  createUniqueGradient(spX, spY) {
    const gradient = ctx.createLinearGradient(
      spX - 30,
      spY + 29,
      spX + 30,
      spY - 30,
    );
    gradient.addColorStop(0, "#090806");
    gradient.addColorStop(0.2, "#8c6415");
    gradient.addColorStop(0.42, "#fff7d0");
    gradient.addColorStop(0.6, "#ffd45a");
    gradient.addColorStop(0.8, "#805510");
    gradient.addColorStop(1, "#050504");
    return gradient;
  }

  paintAccent() {
    ctx.fill();
  }

  drawWings(spX, spY, color) {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.moveTo(spX + 29, spY);
    ctx.lineTo(spX + 30, spY - 3);
    ctx.lineTo(spX + 28, spY - 3);
    ctx.lineTo(spX + 25, spY);
    ctx.lineTo(spX + 29, spY);
    ctx.closePath();
    this.paintAccent();

    ctx.beginPath();
    ctx.moveTo(spX + 30, spY + 2);
    ctx.quadraticCurveTo(spX + 28, spY + 3, spX + 23, spY + 2);
    ctx.lineTo(spX + 20, spY + 5);
    ctx.lineTo(spX + 26, spY + 6);
    ctx.lineTo(spX + 30, spY + 5);
    ctx.lineTo(spX + 30, spY + 2);
    ctx.closePath();
    this.paintAccent();

    ctx.beginPath();
    ctx.moveTo(spX + 29, spY + 9);
    ctx.quadraticCurveTo(spX + 26, spY + 8, spX + 18, spY + 6);
    ctx.lineTo(spX + 14, spY + 9);
    ctx.lineTo(spX + 21, spY + 11);
    ctx.lineTo(spX + 29, spY + 9);
    ctx.closePath();
    this.paintAccent();

    ctx.beginPath();
    ctx.moveTo(spX + 24, spY + 14);
    ctx.quadraticCurveTo(spX + 21, spY + 13, spX + 12, spY + 11);
    ctx.quadraticCurveTo(spX + 8, spY + 13, spX + 5, spY + 15);
    ctx.quadraticCurveTo(spX + 13, spY + 17, spX + 24, spY + 14);
    ctx.closePath();
    this.paintAccent();
  }
}

class RainbowFairyMinionArt {
  draw(rect, options = {}) {
    drawMinionModel(this, rect, options);
  }

  drawArt() {
    const spX = 52;
    const spY = 30;
    const scale = 1.5;

    ctx.save();
    ctx.translate(spX, spY);
    ctx.scale(scale, scale);
    ctx.translate(-spX, -spY);

    ctx.fillStyle = createMinionGradient(spX, spY);
    ctx.beginPath();
    ctx.moveTo(spX, spY);
    ctx.bezierCurveTo(
      spX + 6,
      spY - 2,
      spX + 11,
      spY + 11,
      spX + 10,
      spY + 13,
    );
    ctx.quadraticCurveTo(spX + 8, spY + 14, spX + 3, spY + 11);
    ctx.quadraticCurveTo(spX + 2, spY + 24, spX - 9, spY + 27);
    ctx.quadraticCurveTo(spX - 8, spY + 35, spX - 16, spY + 34);
    ctx.quadraticCurveTo(spX - 12, spY + 32, spX - 15, spY + 28);
    ctx.quadraticCurveTo(spX - 31, spY + 28, spX - 33, spY + 10);
    ctx.quadraticCurveTo(spX - 36, spY + 13, spX - 40, spY + 14);
    ctx.bezierCurveTo(
      spX - 40,
      spY + 6,
      spX - 34,
      spY - 1,
      spX - 30,
      spY,
    );
    ctx.quadraticCurveTo(spX - 30, spY + 3, spX - 30, spY + 2);
    ctx.quadraticCurveTo(spX - 25, spY - 9, spX - 13, spY - 8);
    ctx.quadraticCurveTo(spX - 4, spY - 8, spX, spY + 1);
    ctx.quadraticCurveTo(spX, spY, spX, spY);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(spX + 6, spY + 9);
    ctx.quadraticCurveTo(spX + 3, spY + 7, spX + 1, spY + 3);
    ctx.bezierCurveTo(
      spX - 2,
      spY + 12,
      spX - 2,
      spY + 5,
      spX - 10,
      spY + 15,
    );
    ctx.bezierCurveTo(
      spX - 17,
      spY + 6,
      spX - 20,
      spY + 7,
      spX - 28,
      spY + 6,
    );
    ctx.quadraticCurveTo(spX - 30, spY + 5, spX - 30, spY + 3);
    ctx.quadraticCurveTo(spX - 31, spY + 7, spX - 36, spY + 9);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(spX - 12, spY - 2);
    ctx.quadraticCurveTo(spX - 15, spY - 5, spX - 17, spY - 2);
    ctx.stroke();

    const rightEyeX = spX - 7;
    const eyeY = spY + 3;
    const rightEyeRadius = 3;
    const leftEyeX = spX - 23;
    const leftEyeRadius = 3;
    const eyeStartAngle = -2.7;
    ctx.beginPath();
    ctx.moveTo(
      rightEyeX + Math.cos(eyeStartAngle) * rightEyeRadius,
      eyeY + Math.sin(eyeStartAngle) * rightEyeRadius,
    );
    ctx.arc(rightEyeX, eyeY, rightEyeRadius, eyeStartAngle, -2.9);
    ctx.moveTo(
      leftEyeX + Math.cos(eyeStartAngle) * leftEyeRadius,
      eyeY + Math.sin(eyeStartAngle) * leftEyeRadius,
    );
    ctx.arc(leftEyeX, eyeY, leftEyeRadius, eyeStartAngle, 3.1);
    ctx.fillStyle = "#000";
    ctx.fill();

    ctx.restore();
  }
}

class EnemyMinionArt {
  draw(rect, options = {}) {
    drawMinionModel(this, rect, options);
  }

  drawArt() {
    const spX = 32;
    const spY = 45;
    const scale = 1.4;

    ctx.save();
    ctx.translate(spX, spY);
    ctx.scale(scale, scale);
    ctx.translate(-spX, -spY);

    ctx.fillStyle = this.createEnemyGradient(spX, spY);
    ctx.beginPath();
    ctx.moveTo(spX + 16, spY - 9);
    ctx.quadraticCurveTo(spX + 17, spY - 11, spX + 15, spY - 12);
    ctx.quadraticCurveTo(spX + 23, spY - 10, spX + 23, spY + 3);
    ctx.lineTo(spX + 16, spY - 2);
    ctx.quadraticCurveTo(spX + 15, spY + 12, spX + 4, spY + 14);
    ctx.quadraticCurveTo(spX + 6, spY + 20, spX - 1, spY + 24);
    ctx.bezierCurveTo(
      spX - 3,
      spY + 17,
      spX - 6,
      spY + 19,
      spX - 7,
      spY + 14,
    );
    ctx.quadraticCurveTo(spX - 18, spY + 12, spX - 20, spY - 1);
    ctx.lineTo(spX - 27, spY + 4);
    ctx.quadraticCurveTo(spX - 27, spY - 8, spX - 20, spY - 12);
    ctx.lineTo(spX - 20, spY - 8);
    ctx.quadraticCurveTo(spX - 23, spY - 8, spX - 24, spY - 2);
    ctx.lineTo(spX - 19, spY - 5);
    ctx.quadraticCurveTo(spX - 20, spY - 17, spX - 8, spY - 21);
    ctx.quadraticCurveTo(spX + 7, spY - 23, spX + 12, spY - 16);
    ctx.quadraticCurveTo(spX + 15, spY - 15, spX + 16, spY - 5);
    ctx.lineTo(spX + 20, spY - 2);
    ctx.quadraticCurveTo(spX + 19, spY - 8, spX + 16, spY - 9);
    ctx.closePath();
    ctx.fill();

    this.drawEye(spX, spY, 0, true);
    this.drawEye(spX, spY, 22, false);
    ctx.restore();
  }

  createEnemyGradient(spX, spY) {
    const gradient = ctx.createLinearGradient(
      spX - 30,
      spY + 29,
      spX + 30,
      spY - 30,
    );
    gradient.addColorStop(0, "#321047");
    gradient.addColorStop(0.52, "#d84fee");
    gradient.addColorStop(1, "#6a187c");
    return gradient;
  }

  drawEye(spX, spY, offsetX, mirrored) {
    const startX = spX - 13 + offsetX;
    const direction = mirrored ? -1 : 1;
    const x = (distance) => startX + distance * direction;
    const eyeY = spY - 8;

    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(startX, eyeY + 6);
    ctx.lineTo(x(-9), eyeY);
    ctx.quadraticCurveTo(x(-6), eyeY - 3, x(-3), eyeY - 3);
    ctx.quadraticCurveTo(x(2), eyeY + 1, startX, eyeY + 5);
    ctx.closePath();
    ctx.fill();
  }
}

minionArtRenderers = {
  unicorn: new UnicornMinionArt(),
  rainbow: new RainbowFairyMinionArt(),
  enemy: new EnemyMinionArt(),
};

drawMinionArt = (theme, rect, options = {}) => {
  const renderer = minionArtRenderers[theme];

  if (!renderer) return false;

  renderer.draw(rect, options);
  return true;
};
