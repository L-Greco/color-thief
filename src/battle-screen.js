class BattleScreen {
  constructor(battle) {
    this.battle = battle;
    this.enemyDeckRect = this.createDeckRect(BATTLE_LAYOUT.enemyBoard);
    this.playerDeckRect = this.createDeckRect(BATTLE_LAYOUT.playerHand);
    this.endTurnRect = this.createEndTurnRect(BATTLE_LAYOUT.playerBoard);
    this.endTurnPressed = false;
    this.dragCard = null;
    this.dragOffset = { x: 0, y: 0 };
    this.selectedAction = null;
    this.suppressClick = false;
  }

  update(delta) {
    this.layoutHand(
      this.battle.player.hand,
      BATTLE_LAYOUT.playerHand,
      this.playerDeckRect,
    );
    this.layoutBoard(this.battle.player.board, BATTLE_LAYOUT.playerBoard);
    this.layoutBoard(this.battle.enemy.board, BATTLE_LAYOUT.enemyBoard);
    this.updateCards(this.battle.player.hand, delta, (card) =>
      this.canInteractWithHandCard(card),
    );
    this.updateCards(this.battle.player.board, delta, (card) =>
      this.canStartAttackSelection(card),
    );
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
        (interactive === true || interactive(card)) &&
        this.isPointOnCard(mousePosition, card);

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
    const deckHint = this.canManuallyDrawFromDeck() ? "Click to draw" : "";
    this.drawDeckInfo(this.battle.enemy, this.enemyDeckRect, deckHint);
    this.drawDeckInfo(this.battle.player, this.playerDeckRect, deckHint);
    this.drawTurnPanel();
    this.drawCards(this.battle.enemy.board);
    this.drawCards(this.battle.player.board);
    this.drawCards(this.battle.player.hand);
    this.drawTargetMode();
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
        "Drag simple cards here to play them",
      );
    }

    if (DEBUG_BORDERS) {
      drawBattleDebugBorders();
    }

    this.drawEnemyPreview();
  }

  drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#080d20");
    gradient.addColorStop(0.5, "#172244");
    gradient.addColorStop(1, "#331d3d");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawStarfield(this.battle.game.stars, 0.6);
    this.fillZone(BATTLE_LAYOUT.enemyBoard, "#f8fbffdf");
    this.fillZone(BATTLE_LAYOUT.playerBoard, "#fffdf8df");
    this.fillZone(BATTLE_LAYOUT.playerHand, "#fff8fcdf");
    this.fillZone(BATTLE_LAYOUT.enemyStatus, "#ffffffd0");
    this.fillZone(BATTLE_LAYOUT.playerStatus, "#ffffffd0");
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
    if (hint) {
      ctx.font = "12px Arial";
      ctx.fillText(hint, x + width / 2, y + 118);
    }
  }

  drawCards(cards) {
    cards.forEach((card) => ctx.wrap(() => card.draw()));
  }

  drawEnemyPreview() {
    const card = this.battle.enemyPreviewCard;

    if (!card || card.type !== "spell") return;

    const width = 320;
    const height = 128;
    const x = canvas.width / 2 - width / 2;
    const y = 118;

    ctx.wrap(() => {
      ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 6;
      ctx.fillStyle = "#fffaf4";
      ctx.beginPath();
      ctx.roundRect(x, y, width, height, 20);
      ctx.fill();

      ctx.lineWidth = 3;
      ctx.strokeStyle = "#522567";
      ctx.stroke();

      ctx.fillStyle = "#f6cdfd";
      ctx.fillRect(x + 18, y + 16, 78, 28);
      ctx.fillStyle = "#522567";
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`SPELL ${card.cost}`, x + 57, y + 30);

      ctx.fillStyle = "#222";
      ctx.font = "bold 20px Arial";
      ctx.textAlign = "left";
      ctx.fillText(card.name, x + 116, y + 30);

      ctx.font = "15px Arial";
      this.drawPreviewText(
        card.text || card.effectLabel(),
        x + 24,
        y + 64,
        272,
        20,
      );
    });
  }

  drawPreviewText(text, x, y, maxWidth, lineHeight) {
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

    lines.slice(0, 3).forEach((line, index) => {
      ctx.fillText(line, x, y + index * lineHeight);
    });
  }

  drawTargetMode() {
    if (!this.selectedAction) return;

    this.getActionTargets().forEach((target) =>
      ctx.wrap(() => this.drawTargetMarker(target)),
    );
  }

  setSelectedAction(action) {
    if (this.selectedAction) this.selectedAction.card.isTargetSource = false;

    this.selectedAction = action;

    if (action) action.card.isTargetSource = true;
  }

  drawTargetMarker(target) {
    const rect = this.getTargetRect(target);
    const centerX = rect.x + rect.width / 2;
    const centerY = rect.y + rect.height / 2;

    ctx.strokeStyle = "#1f1f1f";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 28, 0, PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 18, 0, PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX - 36, centerY);
    ctx.lineTo(centerX + 36, centerY);
    ctx.moveTo(centerX, centerY - 36);
    ctx.lineTo(centerX, centerY + 36);
    ctx.stroke();
  }

  getTargetRect(target) {
    if (target.kind === "hero") {
      return target.rect;
    }

    return {
      x: target.x,
      y: target.y,
      width: target.width,
      height: target.height,
    };
  }

  drawTurnPanel() {
    ctx.fillStyle = "#222";
    ctx.font = "18px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#444";
    ctx.fillText(this.getTurnMessage(), 60, 122);

    this.drawEndTurnButton();
  }

  getTurnMessage() {
    if (!this.selectedAction) {
      return this.battle.statusMessage;
    }

    if (this.selectedAction.type === "attack") {
      return "Choose an enemy minion or the enemy hero";
    }

    return this.selectedAction.targetType === "friendlyMinion"
      ? "Choose a friendly minion"
      : "Choose an enemy minion";
  }

  drawEndTurnButton() {
    const { x, y, width, height } = this.endTurnRect;
    const enabled = this.battle.isPlayerTurn();
    const hovered = pointCollision(this.endTurnRect, mousePosition);
    const pressed = enabled && this.endTurnPressed;
    const offsetY = pressed ? 4 : 0;

    ctx.wrap(() => {
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
    });
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
      "Drag simple cards to the board. Click targeted cards or ready minions to choose a target.",
      30,
      410,
    );
  }

  handleClick(point) {
    if (this.suppressClick) {
      this.suppressClick = false;
      return true;
    }

    if (this.dragCard) return false;

    if (this.selectedAction) {
      return this.handleTargetModeClick(point);
    }

    if (
      this.canManuallyDrawFromDeck() &&
      pointCollision(this.playerDeckRect, point)
    ) {
      this.battle.drawCardForPlayer();
      return true;
    }

    if (
      this.canManuallyDrawFromDeck() &&
      pointCollision(this.enemyDeckRect, point)
    ) {
      this.battle.drawCardForEnemy();
      return true;
    }

    const boardMinion = this.findHoveredPlayerBoardMinion(point);

    if (boardMinion && this.canStartAttackSelection(boardMinion)) {
      this.setSelectedAction({
        type: "attack",
        card: boardMinion,
        targetType: "enemyMinion",
      });
      return true;
    }

    const handCard = this.findHoveredHandCard(point);

    if (handCard && this.canStartCardTargetSelection(handCard)) {
      this.setSelectedAction({
        type: "card",
        card: handCard,
        targetType: this.battle.getRequiredTargetType(handCard),
      });
      return true;
    }

    return false;
  }

  handleTargetModeClick(point) {
    const action = this.selectedAction;

    if (!action) return false;
    if (this.isPointOnCard(point, action.card)) {
      this.setSelectedAction(null);
      return true;
    }

    const target = this.findActionTarget(point);

    this.setSelectedAction(null);

    if (!target) {
      return true;
    }

    if (action.type === "attack") {
      if (target.kind === "hero") {
        this.battle.attackHero(
          this.battle.player,
          action.card,
          this.battle.enemy,
        );
      } else {
        this.battle.attackMinion(
          this.battle.player,
          action.card,
          this.battle.enemy,
          target,
        );
      }
      return true;
    }

    this.battle.playCardFromHand(
      this.battle.player,
      this.battle.enemy,
      action.card,
      target,
    );
    return true;
  }

  handlePointerDown(point) {
    if (this.battle.isPlayerTurn() && pointCollision(this.endTurnRect, point)) {
      this.endTurnPressed = true;
      canvas.style.cursor = "pointer";
      return true;
    }

    if (this.selectedAction) return false;

    const card = this.findHoveredHandCard(point);

    if (!card || !this.canDragHandCard(card)) return false;
    if (this.battle.getRequiredTargetType(card)) return false;

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
        this.setSelectedAction(null);
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
    this.suppressClick = true;

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

      if (this.isPointOnCard(point, card)) {
        return card;
      }
    }

    return null;
  }

  findHoveredPlayerBoardMinion(point = mousePosition, ignoredCard = null) {
    return this.findHoveredBoardCard(
      this.battle.player.board,
      point,
      ignoredCard,
    );
  }

  findHoveredEnemyBoardMinion(point = mousePosition) {
    return this.findHoveredBoardCard(this.battle.enemy.board, point);
  }

  findHoveredBoardCard(cards, point, ignoredCard = null) {
    for (let i = cards.length - 1; i >= 0; i -= 1) {
      const card = cards[i];

      if (card === ignoredCard) continue;
      if (this.isPointOnCard(point, card)) {
        return card;
      }
    }

    return null;
  }

  canDragHandCard(card) {
    return !!card && this.battle.isPlayerTurn();
  }

  canStartCardTargetSelection(card) {
    if (!this.canDragHandCard(card)) return false;
    return !!this.battle.getRequiredTargetType(card);
  }

  canStartAttackSelection(card) {
    if (!card) return false;
    return this.battle.canMinionAttack(this.battle.player, card).ok;
  }

  canInteractWithHandCard(card) {
    return this.canDragHandCard(card) || this.canStartCardTargetSelection(card);
  }

  canManuallyDrawFromDeck() {
    return (
      typeof debugConfig !== "undefined" && debugConfig.allowManualDeckDraw
    );
  }

  getActionTargets() {
    if (!this.selectedAction) return [];
    if (this.selectedAction.targetType === "friendlyMinion") {
      return this.battle.player.board;
    }

    if (this.selectedAction.type === "attack") {
      return [
        ...this.battle.enemy.board,
        {
          kind: "hero",
          rect: rectFromZone(BATTLE_LAYOUT.enemyStatus),
        },
      ];
    }

    return this.battle.enemy.board;
  }

  findActionTarget(point) {
    const targets = this.getActionTargets();

    for (let i = targets.length - 1; i >= 0; i -= 1) {
      const target = targets[i];

      if (this.isPointOnTarget(point, target)) {
        return target;
      }
    }

    return null;
  }

  isPointOnCard(point, card) {
    return pointCollision(
      {
        x: card.x,
        y: card.y,
        width: card.width,
        height: card.height,
      },
      point,
    );
  }

  isPointOnTarget(point, target) {
    return pointCollision(this.getTargetRect(target), point);
  }

  updateCursor() {
    if (this.dragCard) {
      canvas.style.cursor = "grabbing";
      return;
    }

    if (this.selectedAction) {
      canvas.style.cursor = this.findActionTarget(mousePosition)
        ? "pointer"
        : "default";
      return;
    }

    if (pointCollision(this.endTurnRect, mousePosition)) {
      canvas.style.cursor = "pointer";
      return;
    }

    const hoveredHandCard = this.findHoveredHandCard();
    const hoveredBoardMinion = this.findHoveredPlayerBoardMinion();

    if (
      (hoveredHandCard && this.canInteractWithHandCard(hoveredHandCard)) ||
      (hoveredBoardMinion && this.canStartAttackSelection(hoveredBoardMinion))
    ) {
      canvas.style.cursor = "pointer";
      return;
    }

    canvas.style.cursor = "default";
  }
}
