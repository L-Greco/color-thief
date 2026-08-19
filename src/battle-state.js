class BattleState {
  turn = 1;
  turnOwner = "player";
  statusMessage = "";
  lastStatusAt = 0;

  constructor(player, enemy) {
    this.player = player;
    this.enemy = enemy;
  }

  start() {
    this.turn = 1;
    this.turnOwner = "player";
    this.player.setDeck(createDeckFromConfig(starterDeckConfig));
    this.enemy.setDeck(createDeckFromConfig(starterDeckConfig));
    shuffle(this.player.deck);
    shuffle(this.enemy.deck);
    this.player.resetBattleState();
    this.enemy.resetBattleState();
    this.player.drawCards(STARTING_HAND_SIZE);
    this.enemy.drawCards(STARTING_HAND_SIZE);
    this.setStatus("Player turn");
  }

  isPlayerTurn() {
    return this.turnOwner === "player";
  }

  setStatus(message) {
    this.statusMessage = message;
    this.lastStatusAt = performance.now();
  }

  update() {
    if (
      this.statusMessage &&
      performance.now() - this.lastStatusAt > 1800 &&
      this.statusMessage !== "Player turn" &&
      this.statusMessage !== "Enemy turn"
    ) {
      this.statusMessage = this.isPlayerTurn() ? "Player turn" : "Enemy turn";
    }
  }

  drawCardForPlayer() {
    if (!this.isPlayerTurn()) {
      this.setStatus("You can only draw on your turn");
      return;
    }

    const card = this.player.drawCard();

    if (card) {
      zzfx(...CARD_DRAW_SOUND);
      this.setStatus(`Drew ${card.name}`);
    } else if (!this.player.canDrawCard()) {
      this.setStatus("Hand is full");
    } else {
      this.setStatus("Deck is empty");
    }
  }

  drawCardForEnemy() {
    const card = this.enemy.drawCard();

    if (card) {
      zzfx(...CARD_DRAW_SOUND);
    }
  }

  canPlayCard(player, card) {
    if (!card) return { ok: false, reason: "No card selected" };
    if (player !== this.player || !this.isPlayerTurn()) {
      return { ok: false, reason: "You can only play on your turn" };
    }
    if (card.cost > player.mana) {
      return { ok: false, reason: "Not enough mana" };
    }
    if (card.type === "minion" && !player.canSummonMinion()) {
      return { ok: false, reason: "Board is full" };
    }

    return { ok: true, reason: "" };
  }

  playCardFromHand(player, opponent, card) {
    const playCheck = this.canPlayCard(player, card);

    if (!playCheck.ok) {
      this.setStatus(playCheck.reason);
      return false;
    }

    const cardIndex = player.hand.indexOf(card);

    if (cardIndex === -1) return false;
    if (!player.spendMana(card.cost)) {
      this.setStatus("Not enough mana");
      return false;
    }

    player.hand.splice(cardIndex, 1);

    if (card.type === "spell") {
      this.resolveSpell(card, player, opponent);
      zzfx(...CARD_DRAW_SOUND);
      this.setStatus(`Cast ${card.name}`);
      return true;
    }

    if (!player.summonMinion(card)) {
      player.hand.splice(cardIndex, 0, card);
      player.mana += card.cost;
      this.setStatus("Board is full");
      return false;
    }

    zzfx(...CARD_DRAW_SOUND);
    this.setStatus(`Played ${card.name}`);
    return true;
  }

  resolveSpell(card, player, opponent) {
    if (card.effect === "draw") {
      player.drawCards(card.amount || 1);
      return;
    }

    if (card.effect === "heal") {
      player.heal(card.amount || 0);
      return;
    }

    if (card.effect === "damage") {
      opponent.takeDamage(card.amount || 0);
    }
  }

  endTurn() {
    if (!this.isPlayerTurn()) return;

    this.turnOwner = "enemy";
    this.setStatus("Enemy turn");
    this.runEnemyTurn();
    this.beginPlayerTurn();
  }

  runEnemyTurn() {
    this.enemy.maxMana = min(10, this.enemy.maxMana + 1);
    this.enemy.refillMana();
    this.enemy.drawCard();
  }

  beginPlayerTurn() {
    this.turn += 1;
    this.turnOwner = "player";
    this.player.maxMana = min(10, this.player.maxMana + 1);
    this.player.refillMana();
    this.player.drawCard();
    this.setStatus("Player turn");
  }
}

function createDeckFromConfig(deckConfig) {
  const deck = [];

  deckConfig.forEach((cardConfig) => {
    for (let i = 0; i < cardConfig.copies; i += 1) {
      deck.push(
        new Card(
          0,
          0,
          CARD_WIDTH,
          CARD_HEIGHT,
          cardConfig.name,
          cardConfig.type || "minion",
          cardConfig.cost || 0,
          cardConfig.health ?? 0,
          cardConfig.attack ?? 0,
          cardConfig.effect || null,
          cardConfig.amount || 0,
        ),
      );
    }
  });

  return deck;
}
