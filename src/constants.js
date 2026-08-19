CARD_WIDTH = 120;
CARD_HEIGHT = 168;
DEBUG_BORDERS = false;

// Game rules
STARTING_HAND_SIZE = 4;
HAND_LIMIT = 7;
MAX_BOARD_SIZE = 5;

starterDeckConfig = [
  { name: "Sunbeam Unicorn", cost: 2, attack: 2, health: 3, copies: 3 },
  { name: "Prism Dragon", cost: 5, attack: 5, health: 4, copies: 2 },
  { name: "Rainbow Goblin", cost: 1, attack: 1, health: 2, copies: 4 },
];

BATTLE_LAYOUT = {
  enemyStatus: [0, 0, 1280, 60],
  enemyBoard: [0, 60, 1280, 190],
  playerBoard: [0, 250, 1280, 190],
  playerHand: [0, 440, 1280, 220],
  playerStatus: [0, 660, 1280, 60],
};

MAX_DELTA = 1000 / 30;
