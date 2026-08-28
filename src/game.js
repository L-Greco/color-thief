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
  }

  setState(newState) {
    this.state = newState;
  }

  setScreen(screen) {
    this.screen = screen;
  }

  startBeginning() {
    this.state = states.starting;
    this.battle = null;
    this.setScreen(new StartingScreen(this));
  }

  startIntro() {
    this.state = states.intro;
    this.battle = null;
    this.setScreen(new IntroScreen(this));
  }

  startDeckBuilding() {
    this.state = states.deckBuilding;
    this.battle = null;
    this.setScreen(new DeckBuildingScreen(this));
  }

  startBattle(playerDeckConfig) {
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
    this.state = states.gameOver;
    this.battle = null;
    this.setScreen(new GameOverScreen(this, outcome));
  }

  update(delta) {
    updateStarfield(this.stars, delta);

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
  }
}
