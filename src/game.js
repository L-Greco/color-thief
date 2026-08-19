states = {
  intro: "Intro",
  deckBuilding: "Deck Building",
  battle: "Battle",
  gameOver: "Game Over",
};

class Game {
  state = states.battle;
  screen = null;
  battle = null;

  constructor(player, enemy) {
    this.player = player;
    this.enemy = enemy;
  }

  setState(newState) {
    this.state = newState;
  }

  setScreen(screen) {
    this.screen = screen;
  }

  startBattle() {
    this.state = states.battle;
    this.battle = new BattleState(this.player, this.enemy);
    this.battle.start();
    this.setScreen(new BattleScreen(this.battle));
  }

  update(delta) {
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
