class IntroScreen {
  constructor(game) {
    this.game = game;
  }

  update() {
    canvas.style.cursor = "pointer";
  }

  draw() {
    const background = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    background.addColorStop(0, "#05070f");
    background.addColorStop(0.55, "#0c1024");
    background.addColorStop(1, "#15112a");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawStarfield(this.game.stars);
    this.drawPlanet();
    this.drawTitle();
  }

  drawPlanet() {
    const x = canvas.width * 0.72;
    const y = canvas.height * 0.58;
    const radius = 210;
    const halo = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius * 1.55);
    halo.addColorStop(0, "rgba(214, 224, 236, 0.22)");
    halo.addColorStop(1, "rgba(214, 224, 236, 0)");

    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x, y, radius * 1.55, 0, PI * 2);
    ctx.fill();

    const planet = ctx.createRadialGradient(
      x - radius * 0.32,
      y - radius * 0.32,
      0,
      x - radius * 0.2,
      y - radius * 0.2,
      radius,
    );
    planet.addColorStop(0, "#d4d8dc");
    planet.addColorStop(0.55, "#7d848c");
    planet.addColorStop(1, "#252b34");

    ctx.fillStyle = planet;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, PI * 2);
    ctx.fill();
  }

  drawTitle() {
    ctx.shadowColor = "rgba(230, 241, 255, 0.55)";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#f8f6e9";
    ctx.font = "900 92px Georgia";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("Color", 105, 302);
    ctx.fillText("Thief", 105, 390);
    ctx.shadowColor = "transparent";
  }

  handlePointerDown() {}

  handlePointerMove() {}

  handlePointerUp() {
    return false;
  }

  handleClick() {
    this.game.startDeckBuilding();
    return true;
  }
}
