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

    ctx.fillStyle = "#000";
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

    ctx.save();
    // The source art keeps the editor's bottom-right coordinate system.
    ctx.translate(x + width, y + height);
    ctx.scale(-scale, -scale);
    this.drawUnicorn(options.unique);
    ctx.restore();
  }

  drawUnicorn(isUnique) {
    const spX = 25;
    const spY = 48;
    const unicornColor = isUnique ? this.createUniqueGradient(spX, spY) : "#fff";

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

minionArtRenderers = {
  unicorn: new UnicornMinionArt(),
};

drawMinionArt = (theme, rect, options = {}) => {
  const renderer = minionArtRenderers[theme];

  if (!renderer) return false;

  renderer.draw(rect, options);
  return true;
};
