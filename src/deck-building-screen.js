class DeckBuildingScreen {
  constructor(game) {
    this.game = game;
    this.selectedSource = playerDeckSources[0];
    this.selectedDeck = [];
    this.sourceDeckButtons = this.createSourceDeckButtons();
    this.sourceCardsPage = 0;
    this.cardsPerPage = 10;
    this.prevPageRect = { x: 70, y: 660, width: 52, height: 36 };
    this.nextPageRect = { x: 658, y: 660, width: 52, height: 36 };
    this.startBattleRect = { x: 930, y: 630, width: 250, height: 56 };
  }

  update() {
    canvas.style.cursor = this.resolveCursor();
  }

  createSourceDeckButtons() {
    return playerDeckSources.map((source, index) => ({
      source,
      rect: {
        x: 70 + index * 260,
        y: 120,
        width: 220,
        height: 130,
      },
    }));
  }

  draw() {
    this.drawBackground();
    this.drawTitle();
    this.drawSourceDeckButtons();
    this.drawSourceCards();
    this.drawPagination();
    this.drawSelectedDeckPanel();
    this.drawStartBattleButton();
  }

  drawBackground() {
    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height,
    );
    gradient.addColorStop(0, "#fff0f6");
    gradient.addColorStop(0.45, "#f7fbff");
    gradient.addColorStop(1, "#f5ffe8");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffffcc";
    ctx.fillRect(40, 40, 760, 620);
    ctx.fillRect(840, 40, 400, 620);
  }

  drawTitle() {
    ctx.fillStyle = "#1f1f1f";
    ctx.font = "bold 34px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("Build Your Deck", 70, 70);

    ctx.font = "18px Arial";
    ctx.fillStyle = "#444";
    ctx.fillText(
      "Choose cards from Unicorn and Rainbow, then go to battle.",
      70,
      102,
    );
  }

  drawSourceDeckButtons() {
    this.sourceDeckButtons.forEach(({ source, rect }) => {
      const selected = this.selectedSource.key === source.key;
      const hovered = pointCollision(rect, mousePosition);

      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.18)";
      ctx.shadowBlur = hovered ? 18 : 10;
      ctx.shadowOffsetY = 5;
      ctx.fillStyle = source.accent;
      ctx.beginPath();
      ctx.roundRect(rect.x, rect.y, rect.width, rect.height, 24);
      ctx.fill();
      ctx.restore();

      if (selected) {
        ctx.strokeStyle = "#1f1f1f";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(
          rect.x + 2,
          rect.y + 2,
          rect.width - 4,
          rect.height - 4,
          22,
        );
        ctx.stroke();
      }

      ctx.fillStyle = "#fff";
      ctx.font = "bold 28px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(source.label, rect.x + rect.width / 2, rect.y + 58);

      ctx.font = "16px Arial";
      ctx.fillText(
        `${source.cards.length} cards`,
        rect.x + rect.width / 2,
        rect.y + 92,
      );
    });
  }

  drawSourceCards() {
    const cards = this.getVisibleSourceCards();
    const startX = 70;
    const startY = 290;
    const columns = 5;
    const gapX = 130;
    const gapY = 190;

    cards.forEach((cardConfig, index) => {
      const x = startX + (index % columns) * gapX;
      const y = startY + floor(index / columns) * gapY;

      const card = this.createPreviewCard(cardConfig, x, y);
      const hovered = pointCollision(
        { x: card.x, y: card.y, width: card.width, height: card.height },
        mousePosition,
      );

      card.setHover(hovered);
      card.update(1 / 60);
      card.draw();
    });
  }

  drawPagination() {
    const totalPages = this.getSourceCardsTotalPages();
    const canGoPrev = this.sourceCardsPage > 0;
    const canGoNext = this.sourceCardsPage < totalPages - 1;

    this.drawPageButton(this.prevPageRect, "‹", canGoPrev);
    this.drawPageButton(this.nextPageRect, "›", canGoNext);

    ctx.fillStyle = "#4f4f4f";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      `${this.sourceCardsPage + 1}/${totalPages}`,
      390,
      this.prevPageRect.y + this.prevPageRect.height / 2,
    );
  }

  drawPageButton(rect, label, enabled) {
    const hovered = enabled && pointCollision(rect, mousePosition);
    ctx.fillStyle = enabled ? (hovered ? "#8be67b" : "#f2f2f2") : "#dddddd";
    ctx.beginPath();
    ctx.roundRect(rect.x, rect.y, rect.width, rect.height, 14);
    ctx.fill();

    ctx.fillStyle = enabled ? "#1f1f1f" : "#8a8a8a";
    ctx.font = "bold 22px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, rect.x + rect.width / 2, rect.y + rect.height / 2 + 1);
  }

  drawSelectedDeckPanel() {
    ctx.fillStyle = "#1f1f1f";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("Deck", 870, 78);

    ctx.font = "18px Arial";
    ctx.fillStyle = this.selectedDeck.length === DECK_SIZE ? "#218c3a" : "#666";
    ctx.fillText(`${this.selectedDeck.length}/${DECK_SIZE}`, 1140, 78);

    const sortedDeck = [...this.selectedDeck].sort(
      (a, b) => a.cost - b.cost || a.name.localeCompare(b.name),
    );

    sortedDeck.forEach((cardConfig, index) => {
      const y = 120 + index * 24;
      const rect = { x: 870, y, width: 330, height: 20 };
      const hovered = pointCollision(rect, mousePosition);

      ctx.fillStyle = hovered ? "#dff6e3" : "#f3f3f3";
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

      ctx.fillStyle = "#1f1f1f";
      ctx.font = "15px Arial";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(cardConfig.name, rect.x + 12, rect.y + 11);

      ctx.textAlign = "right";
      ctx.fillText(`${cardConfig.cost}`, rect.x + rect.width - 12, rect.y + 11);
    });
  }

  drawStartBattleButton() {
    const enabled = this.selectedDeck.length === DECK_SIZE;
    const hovered = pointCollision(this.startBattleRect, mousePosition);
    const gradient = ctx.createLinearGradient(
      this.startBattleRect.x,
      this.startBattleRect.y,
      this.startBattleRect.x,
      this.startBattleRect.y + this.startBattleRect.height,
    );

    if (enabled) {
      gradient.addColorStop(0, "#7ae06f");
      gradient.addColorStop(1, "#2e9d44");
    } else {
      gradient.addColorStop(0, "#bdbdbd");
      gradient.addColorStop(1, "#8f8f8f");
    }

    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
    ctx.shadowBlur = hovered ? 16 : 10;
    ctx.shadowOffsetY = 5;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(
      this.startBattleRect.x,
      this.startBattleRect.y,
      this.startBattleRect.width,
      this.startBattleRect.height,
      24,
    );
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = "#fff";
    ctx.font = "bold 22px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      "Go To Battle",
      this.startBattleRect.x + this.startBattleRect.width / 2,
      this.startBattleRect.y + this.startBattleRect.height / 2,
    );
  }

  createPreviewCard(cardConfig, x, y) {
    const card = new Card(
      x,
      y,
      CARD_WIDTH,
      CARD_HEIGHT,
      cardConfig.name,
      cardConfig.type,
      cardConfig.cost,
      cardConfig.health ?? 0,
      cardConfig.attack ?? 0,
      (cardConfig.effects || []).map((effect) => ({ ...effect })),
    );

    card.hoverDuration = 0.12;
    return card;
  }

  addCardToDeck(cardConfig) {
    if (this.selectedDeck.length >= DECK_SIZE) return;
    if (!this.canAddCard(cardConfig)) return;

    this.selectedDeck.push(createCardConfig(cardConfig));
    zzfx(...CARD_DRAW_SOUND);
  }

  canAddCard(cardConfig) {
    const currentCopies = this.selectedDeck.filter(
      (selectedCard) => selectedCard.name === cardConfig.name,
    ).length;

    return currentCopies < getDeckCopiesLimit(cardConfig);
  }

  resolveCursor() {
    if (
      this.sourceDeckButtons.some(({ rect }) =>
        pointCollision(rect, mousePosition),
      )
    ) {
      return "pointer";
    }

    if (
      (this.sourceCardsPage > 0 &&
        pointCollision(this.prevPageRect, mousePosition)) ||
      (this.sourceCardsPage < this.getSourceCardsTotalPages() - 1 &&
        pointCollision(this.nextPageRect, mousePosition))
    ) {
      return "pointer";
    }

    if (pointCollision(this.startBattleRect, mousePosition)) {
      return this.selectedDeck.length === DECK_SIZE ? "pointer" : "default";
    }

    if (this.findHoveredSourceCard() || this.findHoveredDeckEntry()) {
      return "pointer";
    }

    return "default";
  }

  findHoveredSourceCard() {
    const cards = this.getVisibleSourceCards();
    const startX = 70;
    const startY = 290;
    const columns = 5;
    const gapX = 130;
    const gapY = 190;

    for (let i = 0; i < cards.length; i += 1) {
      const x = startX + (i % columns) * gapX;
      const y = startY + floor(i / columns) * gapY;
      const rect = { x, y, width: CARD_WIDTH, height: CARD_HEIGHT };

      if (pointCollision(rect, mousePosition)) {
        return cards[i];
      }
    }

    return null;
  }

  findHoveredDeckEntry() {
    const sortedDeck = [...this.selectedDeck].sort(
      (a, b) => a.cost - b.cost || a.name.localeCompare(b.name),
    );

    for (let i = 0; i < sortedDeck.length; i += 1) {
      const rect = { x: 870, y: 120 + i * 24, width: 330, height: 20 };

      if (pointCollision(rect, mousePosition)) {
        return sortedDeck[i];
      }
    }

    return null;
  }

  handlePointerDown() {
    return false;
  }

  handlePointerMove() {
    return false;
  }

  handlePointerUp() {
    return false;
  }

  handleClick(point) {
    for (let i = 0; i < this.sourceDeckButtons.length; i += 1) {
      const button = this.sourceDeckButtons[i];

      if (pointCollision(button.rect, point)) {
        this.selectedSource = button.source;
        this.sourceCardsPage = 0;
        return true;
      }
    }

    if (
      this.sourceCardsPage > 0 &&
      pointCollision(this.prevPageRect, point)
    ) {
      this.sourceCardsPage -= 1;
      return true;
    }

    if (
      this.sourceCardsPage < this.getSourceCardsTotalPages() - 1 &&
      pointCollision(this.nextPageRect, point)
    ) {
      this.sourceCardsPage += 1;
      return true;
    }

    const hoveredSourceCard = this.findHoveredSourceCard();

    if (hoveredSourceCard) {
      this.addCardToDeck(hoveredSourceCard);
      return true;
    }

    const hoveredDeckEntry = this.findHoveredDeckEntry();

    if (hoveredDeckEntry) {
      const index = this.selectedDeck.indexOf(hoveredDeckEntry);

      if (index !== -1) {
        this.selectedDeck.splice(index, 1);
      }

      return true;
    }

    if (
      this.selectedDeck.length === DECK_SIZE &&
      pointCollision(this.startBattleRect, point)
    ) {
      this.game.startBattle(this.selectedDeck);
      return true;
    }

    return false;
  }

  getSortedSourceCards() {
    return [...this.selectedSource.cards].sort(
      (a, b) => a.cost - b.cost || a.name.localeCompare(b.name),
    );
  }

  getVisibleSourceCards() {
    const start = this.sourceCardsPage * this.cardsPerPage;
    return this.getSortedSourceCards().slice(start, start + this.cardsPerPage);
  }

  getSourceCardsTotalPages() {
    return max(1, ceil(this.getSortedSourceCards().length / this.cardsPerPage));
  }
}
