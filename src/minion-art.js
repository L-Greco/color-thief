createMinionGradient = (spX, spY, startColor, endColor) => {
  const gradient = ctx.createLinearGradient(
    spX - 30,
    spY + 29,
    spX + 30,
    spY - 30,
  );
  gradient.addColorStop(0, "#ffffff");
  gradient.addColorStop(1, "#6e6e6e");
  // gradient.addColorStop(1, endColor);
  return gradient;
};

mixMinionColor = (from, to, progress) => {
  const fromValue = parseInt(from.slice(1), 16);
  const toValue = parseInt(to.slice(1), 16);
  const fromRed = fromValue >> 16;
  const fromGreen = (fromValue >> 8) & 255;
  const fromBlue = fromValue & 255;
  const toRed = toValue >> 16;
  const toGreen = (toValue >> 8) & 255;
  const toBlue = toValue & 255;

  return `rgb(${round(lerp(fromRed, toRed, progress))}, ${round(lerp(fromGreen, toGreen, progress))}, ${round(lerp(fromBlue, toBlue, progress))})`;
};

createUnicornRestorationGradient = (spX, spY, progress) => {
  const gradient = ctx.createLinearGradient(
    spX - 30,
    spY + 29,
    spX + 30,
    spY - 30,
  );
  gradient.addColorStop(0, mixMinionColor("#d4d8dc", "#ffffff", progress));
  gradient.addColorStop(1, mixMinionColor("#4d535c", "#ffffff", progress));
  return gradient;
};

createFairyRestorationGradient = (spX, spY, progress) => {
  const gradient = ctx.createLinearGradient(
    spX - 34,
    spY + 12,
    spX + 20,
    spY + 12,
  );
  const colorStops = [
    [0, "#d4d8dc", "#f85b9d"],
    [0.16, "#c0c5ca", "#f58b04"],
    [0.31, "#aeb3b9", "#fbe201"],
    [0.43, "#a3a9b0", "#1ae8f6"],
    [0.65, "#999fa7", "#1ae8f6"],
    [0.82, "#858c95", "#0260fb"],
    [1, "#6e747d", "#a500f7"],
  ];

  colorStops.forEach(([position, grey, color]) => {
    gradient.addColorStop(position, mixMinionColor(grey, color, progress));
  });
  return gradient;
};

class UnicornMinionArt {
  draw(rect, options = {}) {
    const sourceWidth = 64;
    const sourceHeight = 96;
    const scale = Math.min(
      rect.width / sourceWidth,
      rect.height / sourceHeight,
    );
    const width = sourceWidth * scale;
    const height = sourceHeight * scale;
    const x = rect.x + (rect.width - width) / 2;
    const y = rect.y + (rect.height - height) / 2;

    if (!options.transparentBackground) {
      ctx.fillStyle = "#000";
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    }

    ctx.save();
    // The source art keeps the editor's bottom-right coordinate system.
    ctx.translate(x + width, y + height);
    ctx.scale(-scale, -scale);
    this.drawUnicorn(options.unique, options.restorationProgress);
    ctx.restore();
  }

  drawUnicorn(isUnique, restorationProgress) {
    const spX = 25;
    const spY = 48;
    const unicornColor =
      typeof restorationProgress === "number"
        ? createUnicornRestorationGradient(spX, spY, restorationProgress)
        : isUnique
          ? this.createUniqueGradient(spX, spY)
          : createMinionGradient(spX, spY, "#d4d8dc", "#fce8ae");

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
    const sourceWidth = 64;
    const sourceHeight = 96;
    const scale = Math.min(
      rect.width / sourceWidth,
      rect.height / sourceHeight,
    );
    const width = sourceWidth * scale;
    const height = sourceHeight * scale;
    const x = rect.x + (rect.width - width) / 2;
    const y = rect.y + (rect.height - height) / 2;

    if (!options.transparentBackground) {
      ctx.fillStyle = "#000";
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    }

    ctx.save();
    // The source art keeps the editor's bottom-right coordinate system.
    ctx.translate(x + width, y + height);
    ctx.scale(-scale, -scale);
    this.drawFairy(options.restorationProgress);
    ctx.restore();
  }

  drawFairy(restorationProgress) {
    const spX = 52;
    const spY = 30;
    const scale = 1.5;

    ctx.save();
    ctx.translate(spX, spY);
    ctx.scale(scale, scale);
    ctx.translate(-spX, -spY);

    ctx.fillStyle =
      typeof restorationProgress === "number"
        ? createFairyRestorationGradient(spX, spY, restorationProgress)
        : createMinionGradient(spX, spY, "#ffffff", "#6e6e6e");
    ctx.beginPath();
    ctx.moveTo(spX, spY);
    ctx.bezierCurveTo(
      spX + 5.5,
      spY - 1.65,
      spX + 11.14,
      spY + 10.58,
      spX + 10.04,
      spY + 13.47,
    );
    ctx.quadraticCurveTo(spX + 8.39, spY + 13.61, spX + 3.02, spY + 10.58);
    ctx.quadraticCurveTo(spX + 2.06, spY + 23.65, spX - 8.94, spY + 26.67);
    ctx.quadraticCurveTo(spX - 7.57, spY + 35.48, spX - 15.54, spY + 34.24);
    ctx.quadraticCurveTo(spX - 12.38, spY + 31.62, spX - 14.72, spY + 27.5);
    ctx.quadraticCurveTo(spX - 30.53, spY + 28.05, spX - 33.42, spY + 10.17);
    ctx.quadraticCurveTo(spX - 36.44, spY + 13.47, spX - 39.88, spY + 13.61);
    ctx.bezierCurveTo(
      spX - 40.3,
      spY + 6.18,
      spX - 33.83,
      spY - 0.69,
      spX - 30.12,
      spY - 0.42,
    );
    ctx.quadraticCurveTo(spX - 30.39, spY + 3.3, spX - 30.12, spY + 1.65);
    ctx.quadraticCurveTo(spX - 24.76, spY - 9.49, spX - 13.34, spY - 7.98);
    ctx.quadraticCurveTo(spX - 3.85, spY - 8.25, spX, spY + 1.37);
    ctx.quadraticCurveTo(spX - 0.28, spY - 0.42, spX - 0.14, spY - 0.42);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(spX + 6.46, spY + 9.48);
    ctx.quadraticCurveTo(spX + 2.75, spY + 7.42, spX + 0.55, spY + 3.43);
    ctx.bezierCurveTo(
      spX - 1.52,
      spY + 11.69,
      spX - 2.34,
      spY + 5.36,
      spX - 10.04,
      spY + 15.4,
    );
    ctx.bezierCurveTo(
      spX - 16.64,
      spY + 5.91,
      spX - 19.67,
      spY + 7.42,
      spX - 28.47,
      spY + 6.32,
    );
    ctx.quadraticCurveTo(spX - 29.84, spY + 4.95, spX - 30.26, spY + 3.16);
    ctx.quadraticCurveTo(spX - 31.36, spY + 6.73, spX - 35.89, spY + 9.21);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(spX - 12.24, spY - 1.65);
    ctx.quadraticCurveTo(spX - 14.99, spY - 4.54, spX - 16.92, spY - 1.65);
    ctx.stroke();

    const rightEyeX = spX - 7.02;
    const eyeY = spY + 2.75;
    const rightEyeRadius = 2.64;
    const leftEyeX = spX - 22.56;
    const leftEyeRadius = 2.58;
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
    const sourceWidth = 64;
    const sourceHeight = 96;
    const scale = Math.min(
      rect.width / sourceWidth,
      rect.height / sourceHeight,
    );
    const width = sourceWidth * scale;
    const height = sourceHeight * scale;
    const x = rect.x + (rect.width - width) / 2;
    const y = rect.y + (rect.height - height) / 2;

    if (!options.transparentBackground) {
      ctx.fillStyle = "#000";
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    }

    ctx.save();
    // The source art keeps the editor's bottom-right coordinate system.
    ctx.translate(x + width, y + height);
    ctx.scale(-scale, -scale);
    this.drawEnemy();
    ctx.restore();
  }

  drawEnemy() {
    const spX = 32;
    const spY = 45;
    const scale = 1.4;

    ctx.save();
    ctx.translate(spX, spY);
    ctx.scale(scale, scale);
    ctx.translate(-spX, -spY);

    ctx.fillStyle = this.createEnemyGradient(spX, spY);
    ctx.beginPath();
    ctx.moveTo(spX + 16.32, spY - 8.93);
    ctx.quadraticCurveTo(spX + 16.61, spY - 10.69, spX + 15.29, spY - 12.45);
    ctx.quadraticCurveTo(spX + 23.1, spY - 9.96, spX + 22.8, spY + 2.94);
    ctx.lineTo(spX + 15.88, spY - 1.6);
    ctx.quadraticCurveTo(spX + 14.7, spY + 11.74, spX + 3.65, spY + 13.65);
    ctx.quadraticCurveTo(spX + 5.57, spY + 20.1, spX - 0.91, spY + 23.91);
    ctx.bezierCurveTo(
      spX - 2.53,
      spY + 16.87,
      spX - 5.63,
      spY + 19.36,
      spX - 7.1,
      spY + 14.09,
    );
    ctx.quadraticCurveTo(spX - 18.29, spY + 11.74, spX - 19.91, spY - 1.16);
    ctx.lineTo(spX - 26.84, spY + 3.68);
    ctx.quadraticCurveTo(spX - 27.28, spY - 7.91, spX - 19.91, spY - 12.16);
    ctx.lineTo(spX - 20.36, spY - 8.49);
    ctx.quadraticCurveTo(spX - 22.71, spY - 8.2, spX - 23.74, spY - 1.6);
    ctx.lineTo(spX - 19.18, spY - 4.68);
    ctx.quadraticCurveTo(spX - 20.36, spY - 17.29, spX - 8.28, spY - 20.96);
    ctx.quadraticCurveTo(spX + 7.48, spY - 23.45, spX + 12.2, spY - 15.68);
    ctx.quadraticCurveTo(spX + 15.44, spY - 14.65, spX + 15.58, spY - 4.83);
    ctx.lineTo(spX + 20, spY - 1.9);
    ctx.quadraticCurveTo(spX + 18.68, spY - 8.35, spX + 16.03, spY - 9.23);
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
    ctx.moveTo(startX, eyeY + 5.57);
    ctx.lineTo(x(-9.14), eyeY);
    ctx.quadraticCurveTo(x(-6.04), eyeY - 2.79, x(-2.66), eyeY - 2.5);
    ctx.quadraticCurveTo(x(1.62), eyeY + 0.58, startX, eyeY + 5.27);
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
