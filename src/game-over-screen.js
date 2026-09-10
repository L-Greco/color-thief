class GameOverScreen {
  constructor(game, outcome) {
    this.game = game;
    this.outcome = outcome;
    this.victoryTime = 0;
    this.victoryThemeStarted = false;
    this.canLeave = outcome === "defeat";
  }

  update(delta) {
    canvas.style.cursor = "pointer";

    if (this.outcome !== "victory") return;

    this.startVictoryTheme();
    this.victoryTime += delta;
    this.canLeave = this.getTheEndProgress() === 1;
  }

  startVictoryTheme() {
    if (this.victoryThemeStarted) return;

    this.victoryThemeStarted = playVictoryTheme();
  }

  draw() {
    const background = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    background.addColorStop(0, "#03050d");
    background.addColorStop(1, "#171128");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawStarfield(this.game.stars, 0.8);

    if (this.outcome === "victory") {
      this.drawVictoryRestoration();
      return;
    }

    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "bold 48px Arial";
    ctx.fillText("Defeat", canvas.width / 2, 150);

    ctx.font = "24px Arial";

    const lines = [
      "The Color Thief drains the last color from the battlefield.",
      "The world fades to grey, and the Unicorns and Rainbows lose their light.",
      "But even in the dark, the story is not over yet.",
    ];

    lines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, 280 + index * 46);
    });

    ctx.font = "20px Arial";
    ctx.fillText("Click to return to deck building", canvas.width / 2, 610);
  }

  getRestorationProgress() {
    return min(1, this.victoryTime / VICTORY_COLOR_RESTORE_DURATION);
  }

  drawVictoryRestoration() {
    const restorationProgress = this.getRestorationProgress();
    const unicornRect = { x: 245, y: 190, width: 290, height: 360 };
    const fairyRect = { x: 745, y: 190, width: 290, height: 360 };

    if (restorationProgress === 1) {
      this.drawVictoryEnding();
      return;
    }

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#f8f6e9";
    ctx.font = "bold 48px Georgia";
    ctx.fillText("Victory", canvas.width / 2, 100);

    this.drawRestorationGlow(unicornRect, "rgba(255, 255, 255, 0.9)", restorationProgress);
    this.drawRestorationGlow(fairyRect, "rgba(248, 91, 157, 0.9)", restorationProgress);
    drawMinionArt("unicorn", unicornRect, {
      transparentBackground: true,
      restorationProgress,
    });
    drawMinionArt("rainbow", fairyRect, {
      transparentBackground: true,
      restorationProgress,
    });
  }

  drawRestorationGlow(rect, color, progress) {
    if (progress === 0) return;

    const centerX = rect.x + rect.width / 2;
    const centerY = rect.y + rect.height / 2;
    const glow = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 210);
    glow.addColorStop(0, color);
    glow.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.globalAlpha = progress * 0.32;
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 210, 0, PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  getEndingTime() {
    return max(0, this.victoryTime - VICTORY_COLOR_RESTORE_DURATION);
  }

  getVictoryLoreLines() {
    return [
      "The Color Thief returns to his grey planet.",
      "He holds a small Rainbow Crystal.",
      "He places it on the ground.",
      "A tiny flower turns red.",
    ];
  }

  getLoreLineProgress(index) {
    const startTime = index * VICTORY_LORE_LINE_STAGGER;
    return min(
      1,
      max(
        0,
        (this.getEndingTime() - startTime) / VICTORY_LORE_LINE_ENTER_DURATION,
      ),
    );
  }

  getTheEndProgress() {
    const lineCount = this.getVictoryLoreLines().length;
    const fadeStart =
      (lineCount - 1) * VICTORY_LORE_LINE_STAGGER +
      VICTORY_LORE_LINE_ENTER_DURATION +
      VICTORY_LORE_END_PAUSE_DURATION;

    return min(
      1,
      max(0, (this.getEndingTime() - fadeStart) / VICTORY_END_FADE_DURATION),
    );
  }

  drawVictoryEnding() {
    const lines = this.getVictoryLoreLines();

    ctx.fillStyle = "#f8f6e9";
    ctx.font = "bold 27px Georgia";
    lines.forEach((line, index) => {
      const progress = this.getLoreLineProgress(index);
      if (progress === 0) return;

      const entersFromRight = index % 2 === 0;
      const startX = entersFromRight ? canvas.width + 400 : -400;
      ctx.globalAlpha = progress;
      ctx.fillText(
        line,
        lerp(startX, canvas.width / 2, easeOut(progress)),
        250 + index * 46,
      );
    });

    const theEndProgress = this.getTheEndProgress();
    if (theEndProgress > 0) {
      ctx.globalAlpha = theEndProgress;
      ctx.font = "900 60px Georgia";
      ctx.fillText("THE END", canvas.width / 2, 490);
    }

    if (theEndProgress === 1) {
      ctx.globalAlpha = 1;
      ctx.font = "20px Georgia";
      ctx.fillText("Click to return to deck building", canvas.width / 2, 670);
    }

    ctx.globalAlpha = 1;
  }

  canShowGameInfo() {
    return this.outcome === "victory" && this.canLeave;
  }

  handlePointerDown() {
    if (this.outcome === "victory") {
      this.startVictoryTheme();
    }

    return false;
  }

  handlePointerMove() {
    return false;
  }

  handlePointerUp() {
    return false;
  }

  handleClick() {
    if (!this.canLeave) {
      return true;
    }

    if (this.outcome === "victory") {
      stopVictoryTheme();
    }
    this.game.startDeckBuilding();
    return true;
  }
}
