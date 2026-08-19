class BattleScreen {
  constructor(battle) {
    this.battle = battle;
    this.enemyDeckRect = this.createDeckRect(BATTLE_LAYOUT.enemyBoard);
    this.playerDeckRect = this.createDeckRect(BATTLE_LAYOUT.playerHand);
    this.endTurnRect = this.createEndTurnRect(BATTLE_LAYOUT.playerBoard);
    this.endTurnPressed = false;
    this.dragCard = null;
    this.dragOffset = { x: 0, y: 0 };
  }

  update(delta) {
    this.layoutHand(
      this.battle.player.hand,
      BATTLE_LAYOUT.playerHand,
      this.playerDeckRect,
    );
    this.layoutBoard(this.battle.player.board, BATTLE_LAYOUT.playerBoard);
    this.layoutBoard(this.battle.enemy.board, BATTLE_LAYOUT.enemyBoard);
    this.updateCards(this.battle.player.hand, delta, true);
    this.updateCards(this.battle.player.board, delta, false);
    this.updateCards(this.battle.enemy.board, delta, false);
    this.updateCursor();
  }

  createDeckRect(zone) {
    return {
      x: zone[0] + zone[2] - 140,
      y: zone[1] + (zone[3] - 150) / 2,
      width: 110,
      height: 150,
    };
  }

  createEndTurnRect(zone) {
    return {
      x: zone[0] + zone[2] - 200,
      y: zone[1] + zone[3] / 2 - 34,
      width: 180,
      height: 68,
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
      if (card === this.dragCard) return;
      card.setPosition(startX + spacing * index, y);
      card.faceDown = false;
    });
  }

  layoutBoard(cards, zone) {
    if (!cards.length) return;

    const spacing = min(
      160,
      (zone[2] - CARD_WIDTH - 120) / max(cards.length - 1, 1),
    );
    const totalWidth = CARD_WIDTH + spacing * (cards.length - 1);
    const startX = zone[0] + (zone[2] - totalWidth) / 2;
    const y = zone[1] + (zone[3] - CARD_HEIGHT) / 2;

    cards.forEach((card, index) => {
      card.setPosition(startX + spacing * index, y);
      card.faceDown = false;
      card.setHover(false);
      card.scale = 1;
    });
  }

  updateCards(cards, delta, interactive) {
    const deltaSeconds = delta / 1000;

    cards.forEach((card) => {
      if (card === this.dragCard) return;

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
    this.drawStatusRow(this.battle.enemy, BATTLE_LAYOUT.enemyStatus, "Enemy");
    this.drawStatusRow(
      this.battle.player,
      BATTLE_LAYOUT.playerStatus,
      "Player",
    );
    this.drawDeckInfo(this.battle.enemy, this.enemyDeckRect, "Click to draw");
    this.drawDeckInfo(this.battle.player, this.playerDeckRect, "Click to draw");
    this.drawTurnPanel();
    this.drawCards(this.battle.enemy.board);
    this.drawCards(this.battle.player.board);
    this.drawCards(this.battle.player.hand);
    this.drawDebugHelp();

    if (!this.battle.enemy.board.length) {
      this.drawBoardHint(
        BATTLE_LAYOUT.enemyBoard,
        "Enemy minions will appear here",
      );
    }

    if (!this.battle.player.board.length) {
      this.drawBoardHint(
        BATTLE_LAYOUT.playerBoard,
        "Drag cards here to play them",
      );
    }

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
    ctx.fillText(`Hand ${player.hand.length}/${HAND_LIMIT}`, 840, centerY);
    ctx.fillText(
      `Board ${player.board.length}/${MAX_BOARD_SIZE}`,
      1040,
      centerY,
    );
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

  drawTurnPanel() {
    ctx.fillStyle = "#222";
    ctx.font = "18px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(`Turn ${this.battle.turn}`, 960, 30);
    ctx.fillText(
      this.battle.isPlayerTurn() ? "Player turn" : "Enemy turn",
      960,
      90,
    );
    ctx.fillStyle = "#444";
    ctx.fillText(this.battle.statusMessage, 960, 122);

    this.drawEndTurnButton();
  }

  drawEndTurnButton() {
    const { x, y, width, height } = this.endTurnRect;
    const enabled = this.battle.isPlayerTurn();
    const hovered = pointCollision(this.endTurnRect, mousePosition);
    const pressed = enabled && this.endTurnPressed;
    const offsetY = pressed ? 4 : 0;

    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
    ctx.shadowBlur = hovered ? 18 : 12;
    ctx.shadowOffsetY = pressed ? 2 : 6;

    const fillGradient = ctx.createLinearGradient(x, y, x, y + height);
    fillGradient.addColorStop(0, enabled ? "#7ae06f" : "#bbbbbb");
    fillGradient.addColorStop(1, enabled ? "#2e9d44" : "#919191");
    ctx.fillStyle = fillGradient;
    ctx.beginPath();
    ctx.roundRect(x, y + offsetY, width, height, 32);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("End Turn", x + width / 2, y + height / 2 + 1 + offsetY);
    ctx.restore();
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
    ctx.fillText(
      `Drag minions/spells to the player board. Hand: ${HAND_LIMIT}, Board: ${MAX_BOARD_SIZE}`,
      30,
      410,
    );
  }

  handleClick(point) {
    if (this.dragCard) return false;

    if (pointCollision(this.playerDeckRect, point)) {
      this.battle.drawCardForPlayer();
      return true;
    }

    if (pointCollision(this.enemyDeckRect, point)) {
      this.battle.drawCardForEnemy();
      return true;
    }

    return false;
  }

  handlePointerDown(point) {
    if (this.battle.isPlayerTurn() && pointCollision(this.endTurnRect, point)) {
      this.endTurnPressed = true;
      canvas.style.cursor = "pointer";
      return true;
    }

    const card = this.findHoveredHandCard(point);

    if (!card) return false;

    this.dragCard = card;
    this.dragOffset.x = point.x - card.x;
    this.dragOffset.y = point.y - card.y;
    canvas.style.cursor = "grabbing";
    return true;
  }

  handlePointerMove(point) {
    if (!this.dragCard) return false;

    this.dragCard.setPosition(
      point.x - this.dragOffset.x,
      point.y - this.dragOffset.y,
    );
    this.dragCard.setHover(false);
    this.dragCard.scale = 1.05;
    canvas.style.cursor = "grabbing";
    return true;
  }

  handlePointerUp(point) {
    if (this.endTurnPressed) {
      this.endTurnPressed = false;

      if (pointCollision(this.endTurnRect, point)) {
        this.battle.endTurn();
        return true;
      }
    }

    if (!this.dragCard) return false;

    const card = this.dragCard;
    const droppedOnPlayerBoard = pointCollision(
      rectFromZone(BATTLE_LAYOUT.playerBoard),
      point,
    );

    this.dragCard = null;
    card.scale = 1;

    if (droppedOnPlayerBoard) {
      this.battle.playCardFromHand(this.battle.player, this.battle.enemy, card);
    } else {
      this.battle.setStatus("Drop cards on the player board");
    }

    return true;
  }

  findHoveredHandCard(point = mousePosition) {
    for (let i = this.battle.player.hand.length - 1; i >= 0; i -= 1) {
      const card = this.battle.player.hand[i];

      if (
        pointCollision(
          {
            x: card.x,
            y: card.y,
            width: card.width,
            height: card.height,
          },
          point,
        )
      ) {
        return card;
      }
    }

    return null;
  }

  updateCursor() {
    if (this.dragCard) {
      canvas.style.cursor = "grabbing";
      return;
    }

    if (pointCollision(this.endTurnRect, mousePosition)) {
      canvas.style.cursor = "pointer";
      return;
    }

    canvas.style.cursor = this.findHoveredHandCard() ? "grab" : "default";
  }
}
