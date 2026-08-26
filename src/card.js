class Card {
  hovered = false;
  hoverDuration = 0.3;
  hoverProgress = 0;
  scale = 1;
  hitEffectTime = 0;
  hitRotation = 0;
  hitOverlayAlpha = 0;
  attackEffectTime = 0;
  attackRotation = 0;
  attackScaleBoost = 0;
  attackDirectionX = 0;
  attackDirectionY = 0;
  attackOffsetX = 0;
  attackOffsetY = 0;
  deathEffectTime = 0;
  deathScale = 1;
  deathRise = 0;
  deathOverlayAlpha = 0;
  drawAlpha = 1;
  isDying = false;

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
    unique = false,
    theme = "neutral",
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
    this.unique = unique;
    this.theme = theme;
    this.canAttack = false;
    this.hasAttacked = false;
    this.faceDown = false;
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

  triggerHitEffect() {
    if (this.isDying) return;
    this.hitEffectTime = HIT_EFFECT_DURATION;
  }

  triggerAttackEffect(targetX = this.x, targetY = this.y) {
    if (this.isDying) return;
    this.attackEffectTime = ATTACK_EFFECT_DURATION;
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    const dx = targetX - centerX;
    const dy = targetY - centerY;
    const distance = hypot(dx, dy) || 1;

    this.attackDirectionX = dx / distance;
    this.attackDirectionY = dy / distance;
  }

  triggerDeathEffect() {
    this.isDying = true;
    this.canAttack = false;
    this.hasAttacked = true;
    this.attackEffectTime = 0;
    this.attackRotation = 0;
    this.attackScaleBoost = 0;
    this.attackDirectionX = 0;
    this.attackDirectionY = 0;
    this.attackOffsetX = 0;
    this.attackOffsetY = 0;
    this.hitEffectTime = 0;
    this.hitRotation = 0;
    this.hitOverlayAlpha = 0;
    this.deathEffectTime = DEATH_EFFECT_DURATION;
  }

  isDeathEffectFinished() {
    return this.isDying && this.deathEffectTime <= 0;
  }

  update(delta) {
    const progressDir = this.hovered ? 1 : -1;

    this.hoverProgress += progressDir * (delta / this.hoverDuration);
    this.hoverProgress = Math.max(0, Math.min(1, this.hoverProgress));

    const easedProgress = this.hovered
      ? easeOut(this.hoverProgress)
      : easeIn(this.hoverProgress);

    this.scale = lerp(1, 1.2, easedProgress);
    this.attackRotation = 0;
    this.attackScaleBoost = 0;
    this.attackOffsetX = 0;
    this.attackOffsetY = 0;
    this.deathScale = 1;
    this.deathRise = 0;
    this.deathOverlayAlpha = 0;
    this.drawAlpha = 1;

    if (this.isDying) {
      this.deathEffectTime = max(0, this.deathEffectTime - delta);

      const progress = 1 - this.deathEffectTime / DEATH_EFFECT_DURATION;

      this.deathScale = lerp(1, DEATH_EFFECT_SHRINK, progress);
      this.deathRise = DEATH_EFFECT_RISE * easeOut(progress);
      this.deathOverlayAlpha =
        DEATH_EFFECT_OVERLAY_ALPHA * (1 - progress * 0.35);
      this.drawAlpha = 1 - easeIn(progress);
      this.hitRotation = 0;
      this.hitOverlayAlpha = 0;
      return;
    }

    if (this.hitEffectTime <= 0) {
      this.hitRotation = 0;
      this.hitOverlayAlpha = 0;
    } else {
      this.hitEffectTime = max(0, this.hitEffectTime - delta);

      const progress = 1 - this.hitEffectTime / HIT_EFFECT_DURATION;
      const intensity = 1 - progress;
      const wobble = sin(progress * PI * HIT_EFFECT_FLASHES);
      const flashPhase = sin(progress * PI * HIT_EFFECT_FLASHES * 2);

      this.hitRotation = wobble * HIT_EFFECT_TILT * intensity;
      this.hitOverlayAlpha =
        flashPhase > 0 ? HIT_EFFECT_OVERLAY_ALPHA * intensity : 0;
    }

    if (this.attackEffectTime <= 0) {
      return;
    }

    this.attackEffectTime = max(0, this.attackEffectTime - delta);

    const attackProgress = 1 - this.attackEffectTime / ATTACK_EFFECT_DURATION;
    const attackWave = sin(attackProgress * PI);
    const attackDirection = sin(attackProgress * PI * 2);

    this.attackRotation = attackDirection * ATTACK_EFFECT_TILT;
    this.attackScaleBoost = ATTACK_EFFECT_SCALE * attackWave;
    this.attackOffsetX =
      this.attackDirectionX * ATTACK_EFFECT_LUNGE * attackWave;
    this.attackOffsetY =
      this.attackDirectionY * ATTACK_EFFECT_LUNGE * attackWave;
  }

  draw() {
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;

    ctx.globalAlpha = this.drawAlpha;
    ctx.translate(centerX, centerY);
    ctx.translate(this.attackOffsetX, this.attackOffsetY);
    ctx.translate(0, -this.deathRise);
    ctx.rotate(this.hitRotation + this.attackRotation);
    ctx.scale(
      (this.scale + this.attackScaleBoost) * this.deathScale,
      (this.scale + this.attackScaleBoost) * this.deathScale,
    );
    ctx.translate(-centerX, -centerY);

    if (this.faceDown) {
      this.drawCardBack();
      return;
    }

    const palette = this.getPalette();
    const artRect = this.getArtRect();
    console.log(artRect);
    const effectRect = this.getEffectRect();

    ctx.shadowColor = "rgba(0, 0, 0, 0.18)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = palette.paper;
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, 8);
    ctx.fill();
    ctx.shadowColor = "transparent";

    ctx.fillStyle = palette.frame;
    ctx.beginPath();
    ctx.roundRect(this.x + 3, this.y + 3, this.width - 6, this.height - 6, 6);
    ctx.fill();

    ctx.fillStyle = palette.paper;
    ctx.fillRect(this.x + 7, this.y + 24, this.width - 14, this.height - 31);

    ctx.fillStyle = palette.banner;
    ctx.fillRect(this.x + 7, this.y + 7, this.width - 14, 22);

    ctx.strokeStyle = palette.border;
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x + 4, this.y + 4, this.width - 8, this.height - 8);
    ctx.lineWidth = 1;
    ctx.strokeStyle = palette.innerBorder;

    this.drawCostBox(palette);
    this.drawName();
    this.drawArt(artRect, palette);
    this.drawEffectBox(effectRect, palette);
    this.drawBadgeIcon(palette);
    this.drawFooter(palette);
    this.drawHitOverlay();
    this.drawDeathOverlay();
  }

  drawHitOverlay() {
    if (this.hitOverlayAlpha <= 0) return;

    ctx.fillStyle = `rgba(255, 70, 70, ${this.hitOverlayAlpha})`;
    ctx.beginPath();
    ctx.roundRect(this.x + 3, this.y + 3, this.width - 6, this.height - 6, 6);
    ctx.fill();
  }

  drawDeathOverlay() {
    if (this.deathOverlayAlpha <= 0) return;

    ctx.fillStyle = `rgba(255, 45, 45, ${this.deathOverlayAlpha})`;
    ctx.beginPath();
    ctx.roundRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4, 8);
    ctx.fill();
  }

  drawCostBox(palette) {
    ctx.fillStyle = "#fff7dc";
    ctx.fillRect(this.x + this.width - 28, this.y + 4, 24, 24);
    ctx.strokeStyle = palette.border;
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x + this.width - 28, this.y + 4, 24, 24);

    ctx.fillStyle = "#24192f";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.cost, this.x + this.width - 16, this.y + 16);
  }

  drawName() {
    ctx.fillStyle = "#fefefe";
    ctx.font = "bold 10px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    this.drawClampedText(
      this.name,
      this.x + 12,
      this.y + 13,
      this.width - 44,
      10,
      2,
    );
  }

  drawArt(rect, palette) {
    ctx.fillStyle = palette.artBg;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    ctx.strokeStyle = palette.innerBorder;
    ctx.lineWidth = 1;
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

    if (
      this.type === "minion" &&
      drawMinionArt(this.theme, rect, {
        unique: this.unique,
        card: this,
      })
    ) {
      return;
    }

    const image = this.getArtImage();

    if (image && image.complete) {
      ctx.imageSmoothingEnabled = false;
      this.drawContainedImage(image, rect, this.type === "spell" ? 0.68 : 0.82);
      ctx.imageSmoothingEnabled = true;
    }
  }

  drawEffectBox(rect, palette) {
    if (!this.effects.length) return;

    ctx.fillStyle = palette.effectBg;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    ctx.strokeStyle = palette.innerBorder;
    ctx.lineWidth = 1;
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

    ctx.fillStyle = palette.text;
    ctx.font = "8px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    this.drawClampedText(
      this.effectLabel(),
      rect.x + 4,
      rect.y + 4,
      rect.width - 8,
      9,
      3,
    );
  }

  drawBadgeIcon(palette) {
    if (this.type !== "minion" || !this.effects.length) return;

    const iconKey = this.getBadgeIconKey();

    if (!iconKey) return;

    const frame = spellIconFrames[iconKey];

    ctx.fillStyle = "#15111d";
    ctx.fillRect(this.x + 8, this.y + 29, 16, 16);
    ctx.strokeStyle = palette.border;
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x + 8, this.y + 29, 16, 16);

    if (!spellIconSheet.complete) return;

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      spellIconSheet,
      frame.x,
      frame.y,
      frame.width,
      frame.height,
      this.x + 9,
      this.y + 30,
      14,
      14,
    );
    ctx.imageSmoothingEnabled = true;
  }

  drawFooter(palette) {
    const footerY = this.y + this.height - 23;

    if (this.type === "minion") {
      this.drawStatBox(this.x + 8, footerY, "#d85f52", this.attack);
      this.drawStatBox(
        this.x + this.width - 24,
        footerY,
        "#5a6ee4",
        this.health,
      );
      if (this.unique) {
        ctx.fillStyle = palette.banner;
        ctx.fillRect(this.x + 25, footerY - 1, this.width - 50, 18);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 8px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("UNIQUE", this.x + this.width / 2, footerY + 8);
      }
      return;
    }

    ctx.fillStyle = palette.banner;
    ctx.fillRect(this.x + 8, footerY, this.width - 16, 15);
    ctx.strokeStyle = palette.border;
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x + 8, footerY, this.width - 16, 15);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 8px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      this.unique ? "UNIQUE" : "SPELL",
      this.x + this.width / 2,
      footerY + 8,
    );
  }

  drawStatBox(x, y, color, value) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 16, 16);
    ctx.strokeStyle = "#20182d";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, 16, 16);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 10px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(value, x + 8, y + 8);
  }

  getArtRect() {
    return {
      x: this.x + 12,
      y: this.y + 31,
      width: this.width - 24,
      height: 64,
    };
  }

  getEffectRect() {
    return {
      x: this.x + 12,
      y: this.y + 99,
      width: this.width - 24,
      height: 39,
    };
  }

  getArtImage() {
    if (this.type === "spell") {
      return this.getSpellIconImage();
    }

    if (this.unique && this.theme === "unicorn") {
      return cardArtImages.unicornUnique || cardArtImages.unicorn || null;
    }

    return cardArtImages[this.theme] || cardArtImages.unicorn || null;
  }

  getSpellIconImage() {
    return spellIconSheet;
  }

  getSpellIconFrame() {
    const iconKey = this.getBadgeIconKey() || "support";
    return spellIconFrames[iconKey];
  }

  getBadgeIconKey() {
    if (!this.effects.length) return null;
    if (this.type === "spell" && this.theme === "enemy") return "void";

    const hasDamage = this.effects.some((effect) => effect.type === "damage");

    if (hasDamage) return "damage";
    return "support";
  }

  drawContainedImage(image, rect, scale = 1) {
    if (this.type === "spell") {
      const frame = this.getSpellIconFrame();
      const size = Math.min(rect.width, rect.height) * scale;
      const dx = rect.x + (rect.width - size) / 2;
      const dy = rect.y + (rect.height - size) / 2;

      ctx.drawImage(
        image,
        frame.x,
        frame.y,
        frame.width,
        frame.height,
        dx,
        dy,
        size,
        size,
      );
      return;
    }

    const ratio =
      Math.min(rect.width / image.width, rect.height / image.height) * scale;
    const drawWidth = image.width * ratio;
    const drawHeight = image.height * ratio;
    const dx = rect.x + (rect.width - drawWidth) / 2;
    const dy = rect.y + (rect.height - drawHeight) / 2;

    ctx.drawImage(image, dx, dy, drawWidth, drawHeight);
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

  drawClampedText(text, x, y, maxWidth, lineHeight, maxLines = 2) {
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
      ctx.fillText(line, x, y + index * lineHeight);
    });
  }

  getPalette() {
    if (this.theme === "rainbow") {
      return {
        paper: "#fff7ea",
        frame: "#37501f",
        banner: "#5b2a76",
        border: "#1d1324",
        innerBorder: "#7d9764",
        artBg: "#1a0f21",
        effectBg: "#f6ebcb",
        text: "#32253e",
      };
    }

    if (this.theme === "enemy") {
      return {
        paper: "#f0ebf6",
        frame: "#2a1939",
        banner: "#51256f",
        border: "#140b1d",
        innerBorder: "#7e57ad",
        artBg: "#0d0712",
        effectBg: "#e2d8ef",
        text: "#24192f",
      };
    }

    return {
      paper: "#f8f3ea",
      frame: "#29529d",
      banner: "#3a2f66",
      border: "#171224",
      innerBorder: "#9f8f62",
      artBg: "#111018",
      effectBg: "#efe4c8",
      text: "#2a2236",
    };
  }

  drawCardBack() {
    ctx.fillStyle = "#2c2142";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = "#120b1e";
    ctx.lineWidth = 3;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "#5f4ca6";
    ctx.fillRect(this.x + 10, this.y + 10, this.width - 20, this.height - 20);
    ctx.strokeStyle = "#ede6ff";
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x + 16, this.y + 16, this.width - 32, this.height - 32);
    ctx.fillStyle = "#ede6ff";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      "COLOR",
      this.x + this.width / 2,
      this.y + this.height / 2 - 12,
    );
    ctx.fillText(
      "THIEF",
      this.x + this.width / 2,
      this.y + this.height / 2 + 12,
    );
  }
}
