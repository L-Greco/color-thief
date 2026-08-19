class BattleState {
  turn = 1;
  turnOwner = "player";
  statusMessage = "";
  lastStatusAt = 0;

  constructor(player, enemy, playerDeckConfig) {
    this.player = player;
    this.enemy = enemy;
    this.playerDeckConfig = playerDeckConfig;
  }

  start() {
    this.turn = 1;
    this.turnOwner = "player";
    this.player.setDeck(createDeckFromConfig(this.playerDeckConfig));
    this.enemy.setDeck(createDeckFromConfig(enemyStarterDeckConfig));
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
      this.resolveCardEffects(card, null, player, opponent);
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

    this.resolveCardEffects(card, "onPlay", player, opponent);
    zzfx(...CARD_DRAW_SOUND);
    this.setStatus(`Played ${card.name}`);
    return true;
  }

  resolveCardEffects(card, trigger, player, opponent) {
    const effects = (card.effects || []).filter(
      (effect) => !effect.trigger || effect.trigger === trigger,
    );

    effects.forEach((effect) => this.applyEffect(effect, player, opponent));
  }

  applyEffect(effect, player, opponent) {
    if (effect.type === "draw") {
      player.drawCards(effect.amount || 1);
      return;
    }

    if (effect.type === "heal") {
      player.heal(effect.amount || 0);
      return;
    }

    if (effect.type === "damage") {
      this.applyDamageEffect(effect, player, opponent);
      return;
    }

    if (effect.type === "buff") {
      const target = player.board[0];

      if (!target) return;
      target.attack += effect.attack || 0;
      target.health += effect.health || 0;
      return;
    }

    if (effect.type === "returnToHand") {
      const target = opponent.board[0];

      if (!target) return;

      opponent.board.splice(0, 1);

      if (opponent.canDrawCard()) {
        opponent.hand.push(target);
      }
    }
  }

  applyDamageEffect(effect, player, opponent) {
    const amount = effect.amount || 0;

    if (effect.target === "enemyMinion") {
      const target = opponent.board[0];

      if (!target) return;
      this.damageMinion(opponent, target, amount, player);
      return;
    }

    if (effect.target === "allEnemyMinions") {
      const targets = [...opponent.board];

      targets.forEach((target) =>
        this.damageMinion(opponent, target, amount, player),
      );
      return;
    }

    opponent.takeDamage(amount);
  }

  damageMinion(controller, minion, amount, opponent) {
    minion.health -= amount;

    if (minion.health > 0) return;

    const minionIndex = controller.board.indexOf(minion);

    if (minionIndex === -1) return;

    controller.board.splice(minionIndex, 1);
    this.resolveCardEffects(minion, "onDeath", controller, opponent);
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
        (cardConfig.effects || []).map((effect) => ({ ...effect })),
        cardConfig.text || "",
      ),
    );
  });

  return deck;
}
