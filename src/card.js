class Card {
  hovered = false;
  hoverDuration = 0.3;
  hoverProgress = 0;
  scale = 1;
  constructor(
    x = 0,
    y = 0,
    width = 50,
    height = 100,
    name = "Unicorn",
    cost = 0,
    health = 2,
    attack = 1,
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.name = name;
    this.cost = cost;
    this.health = health;
    this.attack = attack;
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

    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText(
      this.name,
      this.x + this.width / 2,
      this.y + this.height / 3,
    );

    ctx.restore();
  }
}
