states = {
  starting: "Starting",
  intro: "Intro",
  deckBuilding: "Deck Building",
  battle: "Battle",
  gameOver: "Game Over",
};

class Game {
  state = states.starting;
  screen = null;
  battle = null;

  constructor(player, enemy) {
    this.player = player;
    this.enemy = enemy;
    this.stars = createStarfield();
    this.gameInfoModal = new GameInfoModal();
  }

  setState(newState) {
    this.state = newState;
  }

  setScreen(screen) {
    this.screen = screen;
  }

  startBeginning() {
    this.closeGameInfo();
    this.state = states.starting;
    this.battle = null;
    this.setScreen(new StartingScreen(this));
  }

  startIntro() {
    this.closeGameInfo();
    this.state = states.intro;
    this.battle = null;
    this.setScreen(new IntroScreen(this));
  }

  startDeckBuilding() {
    this.closeGameInfo();
    this.state = states.deckBuilding;
    this.battle = null;
    this.setScreen(new DeckBuildingScreen(this));
  }

  startBattle(playerDeckConfig) {
    this.closeGameInfo();
    this.state = states.battle;
    this.battle = new BattleState(
      this,
      this.player,
      this.enemy,
      playerDeckConfig,
    );
    this.battle.start();
    this.setScreen(new BattleScreen(this.battle));
  }

  showGameOver(outcome) {
    this.closeGameInfo();
    this.state = states.gameOver;
    this.battle = null;
    this.setScreen(new GameOverScreen(this, outcome));
  }

  canShowGameInfo() {
    if (this.state === states.starting || this.state === states.deckBuilding) {
      return true;
    }

    if (this.state === states.intro) {
      return this.screen && this.screen.canShowGameInfo();
    }

    if (this.state === states.battle) {
      return this.battle && !this.battle.isAnimating();
    }

    return this.screen && this.screen.outcome !== "defeat";
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
