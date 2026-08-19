states = {
  intro: "Intro",
  deckBuilding: "Deck Building",
  battle: "Battle",
  gameOver: "Game Over",
};
class Game {
  state = states.battle;

  constructor(player, enemy) {
    this.player = player;
    this.enemy = enemy;
  }

  setState(newState) {
    this.state = newState;
  }
}
