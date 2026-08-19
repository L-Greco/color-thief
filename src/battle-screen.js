class BattleScreen {
  constructor(game) {
    this.game = game;
    this.enemyDeckRect = this.createDeckRect(BATTLE_LAYOUT.enemyBoard);
    this.playerDeckRect = this.createDeckRect(BATTLE_LAYOUT.playerHand);
  }

  update(delta) {
    this.layoutHand(this.game.player.hand, BATTLE_LAYOUT.playerHand, this.playerDeckRect);
    this.updateCards(this.game.player.hand, delta, true);
  }

  createDeckRect(zone) {
    return {
      x: zone[0] + zone[2] - 140,
      y: zone[1] + (zone[3] - 150) / 2,
      width: 110,
      height: 150,
    };
  }

  layoutHand(cards, zone, deckRect) {
    if (!cards.length) return;

    const usableWidth = deckRect.x - zone[0] - 60;
    const spacing = min(
      150,
      (usableWidth - CARD_WIDTH) / max(cards.length - 1, 1),
    );
    const totalWidth = CARD_WIDTH + spacing * (cards.length - 1);
    const startX = zone[0] + max(30, (usableWidth - totalWidth) / 2);
    const y = zone[1] + zone[3] - CARD_HEIGHT - 16;

    cards.forEach((card, index) => {
      card.setPosition(startX + spacing * index, y);
      card.faceDown = false;
    });
  }

  updateCards(cards, delta, interactive) {
    const deltaSeconds = delta / 1000;

    cards.forEach((card) => {
      const isMouseOver =
        interactive &&
        pointCollision(
          {
            x: card.x,
            y: card.y,
            width: card.width,
            height: card.height,
          },
          mousePosition,
        );

      card.setHover(isMouseOver);
      card.update(deltaSeconds);
    });
  }

  draw() {
    this.drawBackground();
    this.drawStatusRow(this.game.enemy, BATTLE_LAYOUT.enemyStatus, "Enemy");
    this.drawStatusRow(this.game.player, BATTLE_LAYOUT.playerStatus, "Player");
    this.drawDeckInfo(this.game.enemy, this.enemyDeckRect, "Click to draw");
    this.drawDeckInfo(this.game.player, this.playerDeckRect, "Click to draw");
    this.drawCards(this.game.player.hand);
    this.drawDebugHelp();
    this.drawBoardHint(BATTLE_LAYOUT.enemyBoard, "Enemy minions will appear here");
    this.drawBoardHint(BATTLE_LAYOUT.playerBoard, "Player minions will appear here");

    if (DEBUG_BORDERS) {
      drawBattleDebugBorders();
    }
  }

  drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#eef8ff");
    gradient.addColorStop(0.5, "#fff4fb");
    gradient.addColorStop(1, "#fef6d8");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.fillZone(BATTLE_LAYOUT.enemyBoard, "#f8fbff");
    this.fillZone(BATTLE_LAYOUT.playerBoard, "#fffdf8");
    this.fillZone(BATTLE_LAYOUT.playerHand, "#fff8fc");
    this.fillZone(BATTLE_LAYOUT.enemyStatus, "#ffffffaa");
    this.fillZone(BATTLE_LAYOUT.playerStatus, "#ffffffaa");
  }

  fillZone(zone, color) {
    ctx.fillStyle = color;
    ctx.fillRect(zone[0], zone[1], zone[2], zone[3]);
  }

  drawStatusRow(player, zone, label) {
    const centerY = zone[1] + zone[3] / 2;

    ctx.fillStyle = "#222";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(label, 40, centerY);
    ctx.fillText(`HP ${player.health}/${player.maxHealth}`, 220, centerY);
    ctx.fillText(`Mana ${player.mana}/${player.maxMana}`, 430, centerY);
    ctx.fillText(`Deck ${player.deck.length}`, 650, centerY);
    ctx.fillText(`Hand ${player.hand.length}`, 840, centerY);
  }

  drawDeckInfo(player, rect, hint) {
    const { x, y, width, height } = rect;

    ctx.fillStyle = "#3a3a3a";
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, width, height);
    ctx.fillStyle = "#fff";
    ctx.font = "22px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Deck", x + width / 2, y + 40);
    ctx.fillText(player.deck.length, x + width / 2, y + 80);
    ctx.font = "12px Arial";
    ctx.fillText(hint, x + width / 2, y + 118);
  }

  drawCards(cards) {
    cards.forEach((card) => card.draw());
  }

  drawBoardHint(zone, label) {
    ctx.fillStyle = "#666";
    ctx.font = "18px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, zone[0] + zone[2] / 2, zone[1] + zone[3] / 2);
  }

  drawDebugHelp() {
    ctx.fillStyle = "#333";
    ctx.font = "16px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("Debug draw: click a deck, or press D for player and E for enemy", 30, 410);
  }

  handleClick(point) {
    if (pointCollision(this.playerDeckRect, point)) {
      this.game.drawCardForPlayer();
      return true;
    }

    if (pointCollision(this.enemyDeckRect, point)) {
      this.game.drawCardForEnemy();
      return true;
    }

    return false;
  }
}
