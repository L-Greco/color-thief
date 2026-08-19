states = {
  intro: "Intro",
  deckBuilding: "Deck Building",
  battle: "Battle",
  gameOver: "Game Over",
};

class Game {
  state = states.battle;
  turn = 1;
  activeScreen = null;

  constructor(player, enemy) {
    this.player = player;
    this.enemy = enemy;
  }

  setState(newState) {
    this.state = newState;
  }

  startBattle() {
    this.state = states.battle;
    this.turn = 1;
    this.player.setDeck(createDeckFromConfig(starterDeckConfig));
    this.enemy.setDeck(createDeckFromConfig(starterDeckConfig));
    shuffle(this.player.deck);
    shuffle(this.enemy.deck);
    this.player.hand = [];
    this.enemy.hand = [];
    this.player.board = [];
    this.enemy.board = [];
    this.player.drawCards(STARTING_HAND_SIZE);
    this.enemy.drawCards(STARTING_HAND_SIZE);
    this.activeScreen = new BattleScreen(this);
  }

  drawCardForPlayer() {
    const card = this.player.drawCard();

    if (card) {
      zzfx(...CARD_DRAW_SOUND);
    }
  }

  drawCardForEnemy() {
    const card = this.enemy.drawCard();

    if (card) {
      zzfx(...CARD_DRAW_SOUND);
    }
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
          cardConfig.cost,
          cardConfig.health,
          cardConfig.attack,
        ),
      );
    }
  });

  return deck;
}
