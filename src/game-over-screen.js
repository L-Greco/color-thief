class GameOverScreen {
  constructor(game, outcome) {
    this.game = game;
    this.outcome = outcome;
    this.canLeave = false;
  }

  update() {
    canvas.style.cursor = "pointer";
  }

  draw() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "bold 48px Arial";
    ctx.fillText(
      this.outcome === "victory" ? "Victory" : "Defeat",
      canvas.width / 2,
      150,
    );

    ctx.font = "24px Arial";

    const lines =
      this.outcome === "victory"
        ? [
            "The Color Thief falls, and the stolen color rushes back into the world.",
            "Rainbows blaze again, Unicorns rise, and the sky remembers how to shine.",
            "At the end, mercy wins, and a small light is sent home with him.",
          ]
        : [
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

  handlePointerDown() {
    this.canLeave = true;
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

    this.game.startDeckBuilding();
    return true;
  }
}
