class BattleScreen {
  constructor(battle) {
    this.battle = battle;
    this.enemyDeckRect = this.createDeckRect(BATTLE_LAYOUT.enemyBoard);
    this.playerDeckRect = this.createDeckRect(BATTLE_LAYOUT.playerHand);
    this.enemyHeroRect = this.createHeroRect(BATTLE_LAYOUT.enemyStatus);
    this.playerHeroRect = this.createHeroRect(BATTLE_LAYOUT.playerStatus);
    this.endTurnRect = this.createEndTurnRect(BATTLE_LAYOUT.playerBoard);
    this.endTurnPressed = false;
    this.dragCard = null;
    this.dragOffset = { x: 0, y: 0 };
    this.selectedAction = null;
    this.suppressClick = false;
    this.knownPlayerHandCards = new Set();
    this.mulliganCards = new Set();
    this.mulliganKeepRect = { x: 410, y: 152, width: 180, height: 42 };
    this.mulliganRedrawRect = { x: 690, y: 152, width: 180, height: 42 };
    this.animateNewPlayerDraws();
  }

  update(delta) {
    this.animateNewPlayerDraws();
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

  animateNewPlayerDraws() {
    const playerHand = this.battle.player.hand;
    const newCards = playerHand.filter(
      (card) => !this.knownPlayerHandCards.has(card),
    );
    const startX =
      this.playerDeckRect.x + (this.playerDeckRect.width - CARD_WIDTH) / 2;
    const startY =
      this.playerDeckRect.y + (this.playerDeckRect.height - CARD_HEIGHT) / 2;

    newCards.forEach((card, index) => {
      card.triggerDrawEffect(startX, startY, index * CARD_DRAW_EFFECT_STAGGER);
    });

    this.knownPlayerHandCards = new Set(playerHand);
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

  createHeroRect(zone) {
    const isPlayerStatus = zone[1] > canvas.height / 2;
    const width = 360;
    const height = 88;

    return {
      x: canvas.width / 2 - width / 2,
      y: isPlayerStatus ? zone[1] - 32 : zone[1] - 14,
      width,
      height,
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
    this.drawStatusRow(
      this.battle.enemy,
      BATTLE_LAYOUT.enemyStatus,
      this.enemyHeroRect,
      "colorThief",
    );
    this.drawStatusRow(
      this.battle.player,
      BATTLE_LAYOUT.playerStatus,
      this.playerHeroRect,
      "player",
    );
    const deckHint = this.canManuallyDrawFromDeck() ? "Click to draw" : "";
    this.drawDeckInfo(this.battle.enemy, this.enemyDeckRect, deckHint);
    this.drawDeckInfo(this.battle.player, this.playerDeckRect, deckHint);
    this.drawTurnPanel();
    this.drawCards(this.battle.enemy.board);
    this.drawCards(this.battle.player.board);
    this.drawCards(this.battle.player.hand);
    this.drawTargetMode();

    if (this.battle.isMulliganActive()) {
      this.drawMulligan();
    }

    if (DEBUG_BORDERS) {
      drawBattleDebugBorders();
    }

    this.drawEnemyPreview();
  }

  drawBackground() {
    ctx.fillStyle = "#05070f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawStarfield(this.battle.game.stars, 0.6);
    this.drawPlayZone(BATTLE_LAYOUT.enemyBoard, "rgba(204, 113, 255, 0.5)");
    this.drawPlayZone(BATTLE_LAYOUT.playerBoard, "rgba(110, 220, 255, 0.5)");
  }

  drawPlayZone(zone, color) {
    const inset = 18;

    ctx.wrap(() => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.setLineDash([12, 10]);
      ctx.beginPath();
      ctx.roundRect(
        zone[0] + inset,
        zone[1] + inset / 2,
        zone[2] - inset * 2,
        zone[3] - inset,
        20,
      );
      ctx.stroke();
      ctx.setLineDash([]);
    });
  }

  drawStatusRow(player, zone, heroRect, heroType) {
    const centerY = zone[1] + zone[3] / 2;

    this.drawStatusStat(
      "MANA",
      `${player.mana}/${player.maxMana}`,
      54,
      centerY,
    );
    this.drawStatusStat("DECK", player.deck.length, 1078, centerY);
    this.drawHeroStatus(player, heroRect, heroType);
  }

  drawStatusStat(label, value, x, centerY) {
    const rect = { x, y: centerY - 18, width: 148, height: 36 };

    ctx.fillStyle = "#303846";
    ctx.beginPath();
    ctx.roundRect(rect.x, rect.y, rect.width, rect.height, 14);
    ctx.fill();

    ctx.fillStyle = "#c7d4e8";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(label, rect.x + 16, centerY);

    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "right";
    ctx.fillText(value, rect.x + rect.width - 16, centerY + 1);
  }

  drawHeroStatus(player, rect, heroType) {
    const healthColor =
      player.health === player.maxHealth ? "#3cae5c" : "#d64045";
    const isColorThief = heroType === "colorThief";
    const centerX = rect.x + rect.width / 2;
    const modelWidth = 58;
    const healthGap = 18;
    const minorOffsetY = 5;
    let healthX;
    let healthY = rect.y + rect.height / 2;

    if (isColorThief) {
      const modelScale = 1.25;
      const modelX = centerX - 27 * modelScale;
      const modelY = rect.y - 32 + minorOffsetY;

      drawColorThief(modelX, modelY, modelScale, 1);
      healthX = modelX + 60 * modelScale + healthGap;
      healthY = rect.y + rect.height - 25;
    } else {
      const modelGap = 2;
      const modelsWidth = modelWidth * 2 + modelGap;
      const modelX = centerX - modelsWidth / 2;

      drawMinionArt(
        "unicorn",
        { x: modelX, y: rect.y + 10, width: modelWidth, height: 88 },
        { transparentBackground: true },
      );
      drawMinionArt(
        "rainbow",
        {
          x: modelX + modelWidth + modelGap,
          y: rect.y + 10,
          width: modelWidth,
          height: 88,
        },
        { transparentBackground: true },
      );
      healthX = modelX + modelsWidth + healthGap;
    }

    ctx.fillStyle = healthColor;
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = isColorThief ? "bottom" : "middle";
    ctx.fillText(player.health, healthX, healthY + 20);
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

  drawMulligan() {
    const ready = this.isMulliganReady();
    const panel = { x: 280, y: 76, width: 720, height: 138 };

    this.mulliganCards.forEach((card) =>
      ctx.wrap(() => this.drawMulliganCardSelection(card)),
    );

    ctx.wrap(() => {
      ctx.fillStyle = "rgba(10, 18, 43)";
      ctx.beginPath();
      ctx.roundRect(panel.x, panel.y, panel.width, panel.height, 22);
      ctx.fill();

      ctx.strokeStyle = "#f3d56d";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#f8f6e9";
      ctx.font = "bold 26px Georgia";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("MULLIGAN", canvas.width / 2, 108);

      ctx.fillStyle = "#dbe7ff";
      ctx.font = "16px Arial";
      ctx.fillText(
        ready
          ? "Select cards to replace, then confirm your opening hand."
          : "Drawing your opening hand...",
        canvas.width / 2,
        132,
      );
    });

    this.drawMulliganButton(this.mulliganKeepRect, "Keep hand", ready);
    this.drawMulliganButton(
      this.mulliganRedrawRect,
      `Redraw ${this.mulliganCards.size}`,
      ready && this.mulliganCards.size > 0,
    );
  }

  drawMulliganCardSelection(card) {
    if (!this.battle.player.hand.includes(card)) return;

    ctx.fillStyle = "rgba(243, 213, 109, 0.24)";
    ctx.beginPath();
    ctx.roundRect(
      card.x - 5,
      card.y - 5,
      card.width + 10,
      card.height + 10,
      12,
    );
    ctx.fill();
    ctx.strokeStyle = "#f3d56d";
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  drawMulliganButton(rect, label, enabled) {
    const hovered = enabled && pointCollision(rect, mousePosition);
    const gradient = ctx.createLinearGradient(
      rect.x,
      rect.y,
      rect.x,
      rect.y + rect.height,
    );

    if (enabled) {
      gradient.addColorStop(0, hovered ? "#4f729c" : "#355b76");
      gradient.addColorStop(1, "#243752");
    } else {
      gradient.addColorStop(0, "#5a6270");
      gradient.addColorStop(1, "#424852");
    }

    ctx.wrap(() => {
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(rect.x, rect.y, rect.width, rect.height, 18);
      ctx.fill();
      ctx.strokeStyle = enabled ? "#a9d9ff" : "#737985";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 17px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        label,
        rect.x + rect.width / 2,
        rect.y + rect.height / 2 + 1,
      );
    });
  }

  isMulliganReady() {
    return this.battle.isMulliganActive() && !this.battle.isAnimating();
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
    let centerX = rect.x + rect.width / 2;
    let centerY = rect.y + rect.height / 2;

    if (target.kind === "hero") {
      centerX += 13;
      centerY += 8;
    }

    ctx.strokeStyle = "#ff9b9f";
    ctx.lineWidth = 3;
    ctx.shadowColor = "rgba(255, 76, 87, 0.9)";
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 0;
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
    const enabled =
      this.battle.isPlayerTurn() && !this.battle.isMulliganActive();
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

  handleClick(point) {
    if (this.battle.isMulliganActive()) {
      return this.handleMulliganClick(point);
    }

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

  handleMulliganClick(point) {
    if (!this.isMulliganReady()) return true;

    if (pointCollision(this.mulliganKeepRect, point)) {
      this.completeMulligan();
      return true;
    }

    if (
      this.mulliganCards.size > 0 &&
      pointCollision(this.mulliganRedrawRect, point)
    ) {
      this.completeMulligan();
      return true;
    }

    const card = this.findHoveredHandCard(point);

    if (!card) return true;

    if (this.mulliganCards.has(card)) {
      this.mulliganCards.delete(card);
    } else {
      this.mulliganCards.add(card);
    }

    return true;
  }

  completeMulligan() {
    this.battle.completeMulligan([...this.mulliganCards]);
    this.mulliganCards.clear();
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
    if (this.battle.isMulliganActive()) return true;

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
    if (this.battle.isMulliganActive()) return true;

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
    return (
      !!card &&
      !card.isDrawing() &&
      !this.battle.isMulliganActive() &&
      this.battle.isPlayerTurn()
    );
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
          rect: this.enemyHeroRect,
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

    if (this.battle.isMulliganActive()) {
      this.updateMulliganCursor();
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

  updateMulliganCursor() {
    if (!this.isMulliganReady()) {
      canvas.style.cursor = "default";
      return;
    }

    const redrawEnabled = this.mulliganCards.size > 0;

    if (
      pointCollision(this.mulliganKeepRect, mousePosition) ||
      (redrawEnabled &&
        pointCollision(this.mulliganRedrawRect, mousePosition)) ||
      this.findHoveredHandCard()
    ) {
      canvas.style.cursor = "pointer";
      return;
    }

    canvas.style.cursor = "default";
  }
}
