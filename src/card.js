class Card {
  hovered = false;
  hoverDuration = 0.3;
  hoverProgress = 0;
  scale = 1;
  constructor(
    x = 0,
    y = 0,
    width = CARD_WIDTH,
    height = CARD_HEIGHT,
    name = "Unicorn",
    type = "minion",
    cost = 0,
    health = 2,
    attack = 1,
    effect = null,
    amount = 0,
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.name = name;
    this.type = type;
    this.cost = cost;
    this.health = health;
    this.attack = attack;
    this.effect = effect;
    this.amount = amount;
  }
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
  setHover(bool) {
    this.hovered = bool;
  }
  update(delta) {
    const progressDir = this.hovered ? 1 : -1;

    this.hoverProgress += progressDir * (delta / this.hoverDuration);

    this.hoverProgress = Math.max(0, Math.min(1, this.hoverProgress));

    const easedProgress = this.hovered
      ? easeOut(this.hoverProgress)
      : easeIn(this.hoverProgress);

    this.scale = lerp(1, 1.2, easedProgress);
  }
  draw() {
    ctx.save();

    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;

    ctx.translate(centerX, centerY);
    ctx.scale(this.scale, this.scale);
    ctx.translate(-centerX, -centerY);

    if (this.faceDown) {
      this.drawCardBack();
      ctx.restore();
      return;
    }

    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    ctx.beginPath();
    ctx.arc(this.x + 15, this.y + 15, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#00b4d8";
    ctx.fill();
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.fillText(this.cost, this.x + 15, this.y + 15);

    if (this.type === "minion") {
      ctx.beginPath();
      ctx.arc(
        this.x + this.width - 15,
        this.y + this.height - 15,
        10,
        0,
        Math.PI * 2,
      );
      ctx.fillStyle = "#D53B2B";
      ctx.fill();
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "white";
      ctx.fillText(
        this.health,
        this.x + this.width - 15,
        this.y + this.height - 15,
      );

      ctx.beginPath();
      ctx.arc(this.x + 15, this.y + this.height - 15, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#EFF345";
      ctx.fill();
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "black";
      ctx.fillText(this.attack, this.x + 15, this.y + this.height - 15);
    } else {
      ctx.fillStyle = "#f6cdfd";
      ctx.fillRect(this.x + 12, this.y + this.height - 34, this.width - 24, 20);
      ctx.fillStyle = "#522567";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("SPELL", this.x + this.width / 2, this.y + this.height - 24);
    }

    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText(
      this.name,
      this.x + this.width / 2,
      this.y + this.height / 3,
    );
    if (this.type === "spell") {
      ctx.font = "10px Arial";
      ctx.fillText(
        this.effectLabel(),
        this.x + this.width / 2,
        this.y + this.height / 2 + 12,
      );
    }

    ctx.restore();
  }

  effectLabel() {
    if (this.effect === "draw") return `Draw ${this.amount}`;
    if (this.effect === "heal") return `Heal ${this.amount}`;
    if (this.effect === "damage") return `Deal ${this.amount}`;
    return this.type;
  }

  drawCardBack() {
    ctx.fillStyle = "#6d5bd0";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = "#2c1d63";
    ctx.lineWidth = 3;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "#f8f3ff";
    ctx.fillRect(this.x + 14, this.y + 14, this.width - 28, this.height - 28);
    ctx.fillStyle = "#6d5bd0";
    ctx.font = "18px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("COLOR", this.x + this.width / 2, this.y + this.height / 2 - 16);
    ctx.fillText("THIEF", this.x + this.width / 2, this.y + this.height / 2 + 16);
  }
}
