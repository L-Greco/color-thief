class StartingScreen {
  constructor(game) {
    this.game = game;
    this.promptTime = 0;
  }

  update(delta) {
    this.promptTime += delta / 1000;
    canvas.style.cursor = "default";
  }

  draw() {
    drawStoryBackground(this.game.stars);

    ctx.shadowColor = "rgba(230, 241, 255, 0.55)";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#f8f6e9";
    ctx.font = "900 92px Georgia";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("Color", 105, 302);
    ctx.fillText("Thief", 105, 390);
    ctx.shadowColor = "transparent";

    const promptOpacity = 0.65 + sin(this.promptTime * 3) * 0.25;
    ctx.fillStyle = `rgba(255, 255, 255, ${promptOpacity})`;
    ctx.font = "bold 20px Georgia";
    ctx.fillText("Press Enter or Space to begin", 108, 466);
    ctx.font = "16px Georgia";
    ctx.fillText("Press i for game info", 108, 496);
  }

  handleKeyDown(event) {
    if (event.code !== "Enter" && event.code !== "Space") {
      return false;
    }

    this.game.startIntro();
    return true;
  }

}
