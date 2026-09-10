class Game {
  screen = null;
  battle = null;

  constructor(player, enemy) {
    this.player = player;
    this.enemy = enemy;
    this.stars = createStarfield();
    this.gameInfoModal = new GameInfoModal();
  }

  startBeginning() {
    this.closeGameInfo();
    this.battle = null;
    this.screen = new StartingScreen(this);
  }

  startIntro() {
    this.closeGameInfo();
    this.battle = null;
    this.screen = new IntroScreen(this);
  }

  startDeckBuilding() {
    this.closeGameInfo();
    this.battle = null;
    this.screen = new DeckBuildingScreen(this);
  }

  startBattle(playerDeckConfig) {
    this.closeGameInfo();
    this.battle = new BattleState(
      this,
      this.player,
      this.enemy,
      playerDeckConfig,
    );
    this.battle.start();
    this.screen = new BattleScreen(this.battle);
  }

  showGameOver(outcome) {
    this.closeGameInfo();
    this.battle = null;
    this.screen = new GameOverScreen(this, outcome);
  }

  canShowGameInfo() {
    if (this.battle) return !this.battle.isAnimating();
    return this.screen?.canShowGameInfo?.() ?? true;
  }

  closeGameInfo() {
    this.gameInfoModal.close();
  }

  handleKeyDown(event) {
    if (this.gameInfoModal.isOpen) {
      return this.gameInfoModal.handleKeyDown(event);
    }

    if (event.code !== "KeyI") return false;
    if (event.repeat || !this.canShowGameInfo()) return true;

    this.gameInfoModal.open();
    return true;
  }

  handlePointerDown() {
    return this.gameInfoModal.isOpen;
  }

  handlePointerMove(point) {
    return this.gameInfoModal.handlePointerMove(point);
  }

  handlePointerUp() {
    return this.gameInfoModal.isOpen;
  }

  handleClick(point) {
    return this.gameInfoModal.handleClick(point);
  }

  update(delta) {
    updateStarfield(this.stars, delta);

    if (this.gameInfoModal.isOpen) return;

    if (this.battle) {
      this.battle.update(delta);
    }

    if (this.screen && this.screen.update) {
      this.screen.update(delta);
    }
  }

  draw() {
    if (this.screen && this.screen.draw) {
      this.screen.draw();
    }

    if (this.gameInfoModal.isOpen) {
      this.gameInfoModal.draw();
    }
  }
}
