class Enemy extends Player {
  turnPhase = "idle";

  constructor(name = "Enemy") {
    super(name);
  }

  resetBattleState() {
    super.resetBattleState();
    this.maxMana = 0;
    this.mana = 0;
    this.turnPhase = "idle";
  }

  beginTurn() {
    this.maxMana = min(10, this.maxMana + 1);
    this.refillMana();
    this.turnPhase = "draw";
  }

  takeStep(battle, opponent) {
    if (this.turnPhase === "idle") {
      return false;
    }

    if (this.turnPhase === "draw") {
      battle.drawCardForEnemy();
      this.turnPhase = "play";
      return true;
    }

    if (this.turnPhase === "play") {
      const card = this.chooseCardToPlay(battle, opponent);
      const target = this.chooseCardTarget(battle, opponent, card);

      if (!card) {
        this.turnPhase = "attack";
        battle.setStatus("Enemy prepares to attack");
        return true;
      }

      if (!battle.playEnemyCard(this, opponent, card, target)) {
        this.turnPhase = "attack";
        battle.setStatus("Enemy prepares to attack");
        return true;
      }

      return true;
    }

    if (this.turnPhase === "attack") {
      const attacker = this.chooseAttacker(battle);

      if (!attacker) {
        this.turnPhase = "done";
        battle.setStatus("Enemy ends turn");
        return true;
      }

      const target = this.chooseAttackTarget(opponent);

      if (target.type === "minion") {
        return battle.attackMinion(this, attacker, opponent, target.value);
      }

      return battle.attackHero(this, attacker, opponent);
    }

    return false;
  }

  chooseCardToPlay(battle, opponent) {
    const playableCards = this.hand.filter((card) =>
      battle.canEnemyPlayCard(this, opponent, card),
    );

    if (!playableCards.length) return null;

    playableCards.sort((a, b) => {
      if (b.cost !== a.cost) return b.cost - a.cost;
      return a.name.localeCompare(b.name);
    });

    return playableCards[0];
  }

  chooseCardTarget(battle, opponent, card) {
    if (!card) return null;

    const targetType = battle.getRequiredTargetType(card);

    if (targetType === "enemyMinion") {
      return opponent.board[0] || null;
    }

    if (targetType === "friendlyMinion") {
      return this.board[0] || null;
    }

    return null;
  }

  chooseAttacker(battle) {
    for (let i = 0; i < this.board.length; i += 1) {
      const minion = this.board[i];

      if (battle.canMinionAttack(this, minion).ok) {
        return minion;
      }
    }

    return null;
  }

  chooseAttackTarget(opponent) {
    if (opponent.board.length) {
      return {
        type: "minion",
        value: opponent.board[0],
      };
    }

    return {
      type: "hero",
      value: opponent,
    };
  }
}
