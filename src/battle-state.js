class BattleState {
  turn = 1;
  turnOwner = "player";
  statusMessage = "";
  lastStatusAt = 0;
  ended = false;
  enemyStepDelay = 1500;
  enemyStepTimer = 0;
  enemyPreviewCard = null;
  enemyPreviewTimer = 0;
  pendingMinionDeaths = [];

  constructor(game, player, enemy, playerDeckConfig) {
    this.game = game;
    this.player = player;
    this.enemy = enemy;
    this.playerDeckConfig = playerDeckConfig;
  }

  start() {
    this.ended = false;
    this.enemyStepTimer = 0;
    this.enemyPreviewCard = null;
    this.enemyPreviewTimer = 0;
    this.pendingMinionDeaths = [];
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

  showEnemyPreview(card) {
    this.enemyPreviewCard = card;
    this.enemyPreviewTimer = this.enemyStepDelay;
  }

  update(delta = 0) {
    if (this.ended) return;

    this.updatePendingMinionDeaths();

    if (this.turnOwner === "enemy") {
      this.updateEnemyTurn(delta);
      if (this.ended) return;
    }

    if (this.enemyPreviewTimer > 0) {
      this.enemyPreviewTimer -= delta;

      if (this.enemyPreviewTimer <= 0) {
        this.enemyPreviewCard = null;
        this.enemyPreviewTimer = 0;
      }
    }

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
    if (this.ended) return;
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
    if (this.ended) return;
    const card = this.enemy.drawCard();

    if (card) {
      zzfx(...CARD_DRAW_SOUND);
      this.setStatus("Enemy drew a card");
    } else if (!this.enemy.canDrawCard()) {
      this.setStatus("Enemy hand is full");
    } else {
      this.setStatus("Enemy deck is empty");
    }
  }

  canUseCard(player, opponent, card) {
    if (this.ended) return { ok: false, reason: "Battle is over" };
    if (!card) return { ok: false, reason: "No card selected" };
    if (card.cost > player.mana) {
      return { ok: false, reason: "Not enough mana" };
    }
    if (card.type === "minion" && !player.canSummonMinion()) {
      return { ok: false, reason: "Board is full" };
    }

    return { ok: true, reason: "" };
  }

  canPlayCard(player, card) {
    if (player !== this.player || !this.isPlayerTurn()) {
      return { ok: false, reason: "You can only play on your turn" };
    }

    return this.canUseCard(player, this.enemy, card);
  }

  canEnemyPlayCard(player, opponent, card) {
    const playCheck = this.canUseCard(player, opponent, card);

    if (!playCheck.ok) return false;
    return this.hasPlayableCardTargets(card, player, opponent);
  }

  playCardFromHand(player, opponent, card, target = null) {
    const playCheck = this.canPlayCard(player, card);

    if (!playCheck.ok) {
      this.setStatus(playCheck.reason);
      return false;
    }

    return this.performCardPlay(player, opponent, card, target);
  }

  playEnemyCard(player, opponent, card, target = null) {
    const playCheck = this.canUseCard(player, opponent, card);

    if (!playCheck.ok) return false;
    return this.performCardPlay(player, opponent, card, target);
  }

  performCardPlay(player, opponent, card, target = null) {
    if (this.ended) return false;
    const targetCheck = this.validateCardTarget(card, player, opponent, target);

    if (!targetCheck.ok) {
      if (player === this.player) {
        this.setStatus(targetCheck.reason);
      }
      return false;
    }

    const cardIndex = player.hand.indexOf(card);

    if (cardIndex === -1) return false;
    if (!player.spendMana(card.cost)) {
      return false;
    }

    player.hand.splice(cardIndex, 1);

    if (card.type === "spell") {
      if (player === this.enemy) {
        this.showEnemyPreview(card);
      }
      if (this.cardHasDamageEffect(card)) {
        zzfx(...SPELL_DAMAGE_SOUND);
      }
      this.resolveCardEffects(card, null, player, opponent, target);
      if (this.checkGameOver()) return true;
      this.setStatus(`Cast ${card.name}`);
      return true;
    }

    if (!player.summonMinion(card)) {
      player.hand.splice(cardIndex, 0, card);
      player.mana += card.cost;
      this.setStatus("Board is full");
      return false;
    }

    card.summon();
    this.resolveCardEffects(card, "onPlay", player, opponent, target);
    if (this.checkGameOver()) return true;
    zzfx(...CARD_DRAW_SOUND);
    this.setStatus(`Played ${card.name}`);
    return true;
  }

  resolveCardEffects(card, trigger, player, opponent, target = null) {
    const effects = (card.effects || []).filter(
      (effect) => !effect.trigger || effect.trigger === trigger,
    );

    effects.forEach((effect) =>
      this.applyEffect(effect, player, opponent, target),
    );
  }

  applyEffect(effect, player, opponent, target) {
    if (effect.type === "draw") {
      player.drawCards(effect.amount || 1);
      return;
    }

    if (effect.type === "heal") {
      this.applyHealEffect(effect, player, target);
      return;
    }

    if (effect.type === "damage") {
      this.applyDamageEffect(effect, player, opponent, target);
      return;
    }

    if (effect.type === "buff") {
      this.applyBuffEffect(effect, player, target);
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

  applyHealEffect(effect, player, target) {
    if (effect.target === "friendlyMinion") {
      if (!target || !player.board.includes(target)) return;
      target.health += effect.amount || 0;
      return;
    }

    player.heal(effect.amount || 0);
  }

  applyBuffEffect(effect, player, target) {
    if (effect.target === "allFriendlyMinions") {
      if (player.board.length) {
        zzfx(...BUFF_SOUND);
      }
      player.board.forEach((minion) => {
        minion.attack += effect.attack || 0;
        minion.health += effect.health || 0;
      });
      return;
    }

    const targetMinion =
      effect.target === "friendlyMinion" ? target : player.board[0];

    if (!targetMinion || !player.board.includes(targetMinion)) return;
    zzfx(...BUFF_SOUND);
    targetMinion.attack += effect.attack || 0;
    targetMinion.health += effect.health || 0;
  }

  applyDamageEffect(effect, player, opponent, target) {
    const amount = effect.amount || 0;

    if (effect.target === "enemyMinion") {
      if (!target || !opponent.board.includes(target)) return;

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
    minion.triggerHitEffect();

    if (minion.health > 0) return;

    this.destroyMinion(controller, minion, opponent);
  }

  destroyMinion(controller, minion, opponent) {
    if (!controller.board.includes(minion) || minion.isDying) return;

    minion.triggerDeathEffect();
    this.pendingMinionDeaths.push({ controller, minion, opponent });
  }

  updatePendingMinionDeaths() {
    if (!this.pendingMinionDeaths.length) return;

    this.pendingMinionDeaths = this.pendingMinionDeaths.filter((entry) => {
      if (!entry.minion.isDeathEffectFinished()) {
        return true;
      }

      const minionIndex = entry.controller.board.indexOf(entry.minion);

      if (minionIndex !== -1) {
        entry.controller.board.splice(minionIndex, 1);
        this.resolveCardEffects(
          entry.minion,
          "onDeath",
          entry.controller,
          entry.opponent,
        );
      }

      return false;
    });
  }

  validateCardTarget(card, player, opponent, target) {
    const targetType = this.getRequiredTargetType(card);

    if (!targetType) return { ok: true, reason: "" };
    if (!target) {
      return {
        ok: false,
        reason:
          targetType === "friendlyMinion"
            ? "Choose a friendly minion"
            : "Choose an enemy minion",
      };
    }

    if (targetType === "enemyMinion" && !opponent.board.includes(target)) {
      return { ok: false, reason: "Choose an enemy minion" };
    }

    if (targetType === "friendlyMinion" && !player.board.includes(target)) {
      return { ok: false, reason: "Choose a friendly minion" };
    }

    return { ok: true, reason: "" };
  }

  getRequiredTargetType(card) {
    const effects = card.effects || [];

    for (let i = 0; i < effects.length; i += 1) {
      const target = effects[i].target;

      if (target === "enemyMinion" || target === "friendlyMinion") {
        return target;
      }
    }

    return null;
  }

  cardHasDamageEffect(card) {
    return (card.effects || []).some((effect) => effect.type === "damage");
  }

  attackMinion(attackerController, attacker, defenderController, defender) {
    const attackCheck = this.canMinionAttack(attackerController, attacker);

    if (!attackCheck.ok) {
      this.setStatus(attackCheck.reason);
      return false;
    }
    if (!defender || !defenderController.board.includes(defender)) {
      this.setStatus("Choose an enemy minion");
      return false;
    }

    const attackerDamage = attacker.attack || 0;
    const defenderDamage = defender.attack || 0;
    const defenderCenterX = defender.x + defender.width / 2;
    const defenderCenterY = defender.y + defender.height / 2;

    zzfx(...MINION_ATTACK_SOUND);
    attacker.exhaust();
    attacker.triggerAttackEffect(defenderCenterX, defenderCenterY);
    defender.health -= attackerDamage;
    attacker.health -= defenderDamage;
    defender.triggerHitEffect();

    if (defender.health <= 0) {
      this.destroyMinion(defenderController, defender, attackerController);
    }

    if (attacker.health <= 0) {
      this.destroyMinion(attackerController, attacker, defenderController);
    }

    if (this.checkGameOver()) return true;
    this.setStatus(`${attacker.name} attacked ${defender.name}`);
    return true;
  }

  attackHero(attackerController, attacker, defender) {
    const attackCheck = this.canMinionAttack(attackerController, attacker);

    if (!attackCheck.ok) {
      this.setStatus(attackCheck.reason);
      return false;
    }

    zzfx(...MINION_ATTACK_SOUND);
    attacker.exhaust();
    attacker.triggerAttackEffect(canvas.width / 2, defender === this.player ? 690 : 30);
    defender.takeDamage(attacker.attack || 0);
    if (this.checkGameOver()) return true;
    this.setStatus(`${attacker.name} attacked ${defender.name}`);
    return true;
  }

  hasPlayableCardTargets(card, player, opponent) {
    const effects = card.effects || [];

    if (!effects.length) return true;

    return effects.every((effect) =>
      this.effectHasPlayableTarget(effect, player, opponent),
    );
  }

  effectHasPlayableTarget(effect, player, opponent) {
    if (!effect.target) return true;
    if (effect.target === "enemyMinion") return opponent.board.length > 0;
    if (effect.target === "allEnemyMinions") return opponent.board.length > 0;
    if (effect.target === "friendlyMinion") return player.board.length > 0;
    if (effect.target === "allFriendlyMinions") return player.board.length > 0;
    return true;
  }

  endTurn() {
    if (this.ended) return;
    if (!this.isPlayerTurn()) return;

    this.turnOwner = "enemy";
    this.setStatus("Enemy turn");
    this.runEnemyTurn();
  }

  runEnemyTurn() {
    if (this.ended) return;
    this.readyBoardForTurn(this.enemy);
    this.enemy.beginTurn();
    this.enemyStepTimer = this.enemyStepDelay;
  }

  beginPlayerTurn() {
    if (this.ended) return;
    this.turn += 1;
    this.turnOwner = "player";
    this.player.maxMana = min(10, this.player.maxMana + 1);
    this.player.refillMana();
    this.readyBoardForTurn(this.player);
    this.player.drawCard();
    this.setStatus("Player turn");
  }

  readyBoardForTurn(player) {
    player.board.forEach((minion) => minion.readyForTurn());
  }

  isCurrentTurnController(player) {
    return (
      (player === this.player && this.turnOwner === "player") ||
      (player === this.enemy && this.turnOwner === "enemy")
    );
  }

  canMinionAttack(player, minion) {
    if (this.ended) {
      return { ok: false, reason: "Battle is over" };
    }
    if (!minion || minion.type !== "minion") {
      return { ok: false, reason: "Only minions can attack" };
    }
    if (!player.board.includes(minion)) {
      return { ok: false, reason: "Minion is not on the board" };
    }
    if (!this.isCurrentTurnController(player)) {
      return { ok: false, reason: "You can only attack on your turn" };
    }
    if (!minion.canAttack) {
      return { ok: false, reason: "This minion can't attack yet" };
    }

    return { ok: true, reason: "" };
  }

  checkGameOver() {
    if (this.ended) return true;

    if (this.enemy.health <= 0) {
      this.finishBattle("victory");
      return true;
    }

    if (this.player.health <= 0) {
      this.finishBattle("defeat");
      return true;
    }

    return false;
  }

  finishBattle(outcome) {
    if (this.ended) return;

    this.ended = true;
    if (outcome === "defeat") {
      zzfx(...DEFEAT_SOUND);
    }
    this.game.showGameOver(outcome);
  }

  updateEnemyTurn(delta) {
    this.enemyStepTimer -= delta;

    if (this.enemyStepTimer > 0) return;

    if (this.enemy.takeStep(this, this.player)) {
      this.enemyStepTimer = this.enemyStepDelay;
      return;
    }

    this.beginPlayerTurn();
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
        !!cardConfig.unique,
        inferCardTheme(cardConfig),
      ),
    );
  });

  return deck;
}
