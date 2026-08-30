const GAME_INFO_RULES = [
  [
    "Build a deck",
    "Choose 20 cards from the Unicorn and Rainbow collections before battle.",
  ],
  [
    "Draw and manage your hand",
    "Start with 4 cards. Your hand can hold up to 7 cards.",
  ],
  [
    "Grow your mana",
    "Your mana refills and grows by 1 each turn, up to 10.",
  ],
  [
    "Play cards",
    "Spend mana to play minions and spells. Some spells need a target.",
  ],
  [
    "Attack wisely",
    "Minions cannot attack on the turn they are played. You can have 5 minions on the board.",
  ],
  [
    "Win the battle",
    "Reduce the Color Thief to 0 HP before your own hero reaches 0 HP.",
  ],
];

class GameInfoModal {
  constructor() {
    this.isOpen = false;
    this.closeRect = { x: 1042, y: 76, width: 66, height: 34 };
    this.isCloseHovered = false;
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.isCloseHovered = false;
    canvas.style.cursor = "default";
  }

  handleKeyDown(event) {
    if (!this.isOpen) return false;

    if (
      !event.repeat &&
      (event.code === "KeyI" || event.code === "Escape")
    ) {
      this.close();
    }

    return true;
  }

  handlePointerMove(point) {
    if (!this.isOpen) return false;

    this.isCloseHovered = pointCollision(this.closeRect, point);
    canvas.style.cursor = this.isCloseHovered ? "pointer" : "default";
    return true;
  }

  handleClick(point) {
    if (!this.isOpen) return false;

    if (pointCollision(this.closeRect, point)) {
      this.close();
    }

    return true;
  }

  draw() {
    const panel = { x: 150, y: 54, width: 980, height: 612 };

    ctx.wrap(() => {
      ctx.fillStyle = "rgba(2, 5, 18, 0.78)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const panelFill = ctx.createLinearGradient(
        panel.x,
        panel.y,
        panel.x,
        panel.y + panel.height,
      );
      panelFill.addColorStop(0, "#18213f");
      panelFill.addColorStop(0.52, "#101a34");
      panelFill.addColorStop(1, "#211336");

      ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
      ctx.shadowBlur = 32;
      ctx.shadowOffsetY = 14;
      ctx.fillStyle = panelFill;
      ctx.beginPath();
      ctx.roundRect(panel.x, panel.y, panel.width, panel.height, 28);
      ctx.fill();
      ctx.shadowColor = "transparent";

      const border = ctx.createLinearGradient(
        panel.x,
        panel.y,
        panel.x + panel.width,
        panel.y + panel.height,
      );
      border.addColorStop(0, "#78e9ff");
      border.addColorStop(0.45, "#f6e171");
      border.addColorStop(1, "#ff78d8");
      ctx.strokeStyle = border;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(panel.x + 2, panel.y + 2, panel.width - 4, panel.height - 4, 26);
      ctx.stroke();

      this.drawHeader(panel);
      this.drawRules();
      this.drawFooter(panel);
    });
  }

  drawHeader(panel) {
    ctx.fillStyle = "#f8f6e9";
    ctx.font = "900 46px Georgia";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("Game Info", panel.x + 54, panel.y + 70);

    ctx.fillStyle = "#dbe7ff";
    ctx.font = "bold 21px Georgia";
    ctx.fillText(
      "Color Thief is a deck-building card game.",
      panel.x + 54,
      panel.y + 116,
    );

    ctx.fillStyle = "#c1cde7";
    ctx.font = "18px Arial";
    ctx.fillText(
      "Build a deck of Unicorns and Rainbows, then take back the stolen color.",
      panel.x + 54,
      panel.y + 146,
    );

    ctx.fillStyle = "#f3d56d";
    ctx.font = "bold 16px Arial";
    ctx.fillText("HOW TO PLAY", panel.x + 54, panel.y + 204);

    const hoveredFill = this.isCloseHovered ? "#f8f6e9" : "#293659";
    ctx.fillStyle = hoveredFill;
    ctx.beginPath();
    ctx.roundRect(
      this.closeRect.x,
      this.closeRect.y,
      this.closeRect.width,
      this.closeRect.height,
      12,
    );
    ctx.fill();
    ctx.strokeStyle = "#8eb5e9";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = this.isCloseHovered ? "#17203d" : "#f8f6e9";
    ctx.font = "bold 15px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      "Close",
      this.closeRect.x + this.closeRect.width / 2,
      this.closeRect.y + this.closeRect.height / 2 + 1,
    );
  }

  drawRules() {
    const columnX = [206, 686];

    GAME_INFO_RULES.forEach(([title, description], index) => {
      const column = index < 3 ? 0 : 1;
      const row = index % 3;
      this.drawRule(
        index + 1,
        title,
        description,
        columnX[column],
        306 + row * 102,
      );
    });
  }

  drawRule(index, title, description, x, y) {
    ctx.fillStyle = "#74e6ff";
    ctx.beginPath();
    ctx.arc(x, y, 17, 0, PI * 2);
    ctx.fill();

    ctx.fillStyle = "#10223a";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(index, x, y + 1);

    ctx.fillStyle = "#f8f6e9";
    ctx.font = "bold 20px Georgia";
    ctx.textAlign = "left";
    ctx.fillText(title, x + 32, y - 3);

    ctx.fillStyle = "#d3dcf3";
    ctx.font = "16px Arial";
    this.drawWrappedText(description, x + 32, y + 23, 360, 21);
  }

  drawWrappedText(text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    const lines = [];
    let line = "";

    words.forEach((word) => {
      const nextLine = line ? `${line} ${word}` : word;

      if (ctx.measureText(nextLine).width <= maxWidth || !line) {
        line = nextLine;
        return;
      }

      lines.push(line);
      line = word;
    });

    if (line) lines.push(line);

    lines.slice(0, 3).forEach((wrappedLine, index) => {
      ctx.fillText(wrappedLine, x, y + index * lineHeight);
    });
  }

  drawFooter(panel) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
    ctx.fillRect(panel.x + 54, panel.y + 546, panel.width - 108, 1);

    ctx.fillStyle = "#dbe7ff";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      "Press I or Esc to close",
      canvas.width / 2,
      panel.y + 578,
    );
  }
}
