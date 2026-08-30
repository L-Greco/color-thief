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
    const background = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    background.addColorStop(0, "#05070f");
    background.addColorStop(0.55, "#0c1024");
    background.addColorStop(1, "#15112a");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawStarfield(this.game.stars);
    drawStoryPlanet(canvas.width * 0.72, canvas.height * 0.58, 210);

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
    ctx.fillText("Press I for game info", 108, 496);
  }

  handleKeyDown(event) {
    if (event.code !== "Enter" && event.code !== "Space") {
      return false;
    }

    this.game.startIntro();
    return true;
  }

  handlePointerDown() {
    return false;
  }

  handlePointerMove() {}

  handlePointerUp() {
    return false;
  }

  handleClick() {
    return false;
  }
}
