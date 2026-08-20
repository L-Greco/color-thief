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
    effects = [],
    text = "",
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
    this.effects = effects;
    this.text = text;
    this.canAttack = false;
    this.hasAttacked = false;
  }
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
  setHover(bool) {
    this.hovered = bool;
  }
  summon() {
    this.canAttack = false;
    this.hasAttacked = false;
  }
  readyForTurn() {
    if (this.type !== "minion") return;
    this.canAttack = true;
    this.hasAttacked = false;
  }
  exhaust() {
    if (this.type !== "minion") return;
    this.canAttack = false;
    this.hasAttacked = true;
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
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;

    ctx.translate(centerX, centerY);
    ctx.scale(this.scale, this.scale);
    ctx.translate(-centerX, -centerY);

    if (this.faceDown) {
      this.drawCardBack();
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
    if (this.effects.length > 0) {
      ctx.font = "9px Arial";
      this.drawCenteredText(this.effectLabel(), this.y + this.height / 2 + 2, 10, 4);
    }
  }

  effectLabel() {
    if (this.text) return this.text;

    const primaryEffect = this.effects[0];

    if (!primaryEffect) return this.type;
    const triggerLabel = this.effectTriggerLabel(primaryEffect.trigger);
    const effectLabel = this.primaryEffectLabel(primaryEffect);

    return triggerLabel ? `${triggerLabel}: ${effectLabel}` : effectLabel;
  }

  effectTriggerLabel(trigger) {
    if (trigger === "onPlay") return "On Play";
    if (trigger === "onDeath") return "On Death";
    return "";
  }

  primaryEffectLabel(effect) {
    if (effect.type === "draw") return `Draw ${effect.amount}`;
    if (effect.type === "heal") return `Heal ${effect.amount}`;
    if (effect.type === "damage") return `Deal ${effect.amount}`;
    if (effect.type === "buff") return "Buff";
    if (effect.type === "returnToHand") return "Bounce";
    return this.type;
  }

  drawCenteredText(text, startY, lineHeight, maxLines = 2) {
    const maxWidth = this.width - 20;
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    words.forEach((word) => {
      const nextLine = currentLine ? `${currentLine} ${word}` : word;

      if (ctx.measureText(nextLine).width <= maxWidth || !currentLine) {
        currentLine = nextLine;
        return;
      }

      lines.push(currentLine);
      currentLine = word;
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    lines.slice(0, maxLines).forEach((line, index) => {
      ctx.fillText(line, this.x + this.width / 2, startY + index * lineHeight);
    });
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
