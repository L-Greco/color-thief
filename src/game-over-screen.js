class GameOverScreen {
  constructor(game, outcome) {
    this.game = game;
    this.outcome = outcome;
  }

  update() {
    canvas.style.cursor = "pointer";
  }

  draw() {
    drawStarfield(this.game.stars, 0.8);

    ctx.fillStyle = "#f8f6e9";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 56px Georgia";
    ctx.fillText(
      this.outcome === "victory" ? "Victory" : "Defeat",
      canvas.width / 2,
      canvas.height / 2 - 32,
    );
    ctx.font = "20px Georgia";
    ctx.fillText(
      "Click to return to deck building",
      canvas.width / 2,
      canvas.height / 2 + 42,
    );
  }

  handleClick() {
    this.game.startDeckBuilding();
    return true;
  }
}
